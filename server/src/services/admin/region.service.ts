import { Op } from 'sequelize';
import RegionInfo from '../../models/mysql/RegionInfo';
import CountryInfo from '../../models/mysql/CountryInfo';
import { ERROR_CODES, AppError } from '../../constants/error';

export class AdminRegionService {
  async getRegionList(params: {
    page?: number;
    pageSize?: number;
    regionName?: string;
    regionType?: number;
    status?: number;
  }) {
    const { page = 1, pageSize = 10, regionName, regionType, status } = params;
    const offset = (page - 1) * pageSize;

    const where: any = {};
    if (regionName) {
      where.regionName = { [Op.like]: `%${regionName}%` };
    }
    if (regionType !== undefined) {
      where.regionType = regionType;
    }
    if (status !== undefined) {
      where.status = status;
    }

    const { count, rows } = await RegionInfo.findAndCountAll({
      where,
      offset,
      limit: pageSize,
      order: [['sortOrder', 'ASC'], ['id', 'ASC']],
      include: [
        {
          model: CountryInfo,
          as: 'countries',
          attributes: ['id', 'countryName'],
          required: false,
        },
      ],
    });

    return {
      total: count,
      page,
      pageSize,
      list: rows.map((region) => ({
        id: region.id,
        regionName: region.regionName,
        regionNameEn: region.regionNameEn,
        regionType: region.regionType,
        description: region.description,
        coverImage: region.coverImage,
        sortOrder: region.sortOrder,
        status: region.status,
        countryCount: region.countries?.length || 0,
        createTime: region.createTime,
        updateTime: region.updateTime,
      })),
    };
  }

  async getRegionDetail(regionId: number) {
    const region = await RegionInfo.findByPk(regionId, {
      include: [
        {
          model: CountryInfo,
          as: 'countries',
          attributes: ['id', 'countryName', 'countryNameEn', 'status'],
          required: false,
        },
      ],
    });

    if (!region) {
      throw new AppError(ERROR_CODES.REGION_NOT_FOUND, '区域不存在');
    }

    return {
      id: region.id,
      regionName: region.regionName,
      regionNameEn: region.regionNameEn,
      regionType: region.regionType,
      description: region.description,
      coverImage: region.coverImage,
      sortOrder: region.sortOrder,
      status: region.status,
      countries: region.countries,
      createTime: region.createTime,
      updateTime: region.updateTime,
    };
  }

  async createRegion(data: {
    regionName: string;
    regionNameEn?: string;
    regionType: number;
    description?: string;
    coverImage?: string;
    sortOrder?: number;
  }) {
    const existingRegion = await RegionInfo.findOne({
      where: { regionName: data.regionName },
    });

    if (existingRegion) {
      throw new AppError(ERROR_CODES.REGION_ALREADY_EXISTS, '区域名称已存在');
    }

    const region = await RegionInfo.create({
      regionName: data.regionName,
      regionNameEn: data.regionNameEn || '',
      regionType: data.regionType,
      description: data.description || '',
      coverImage: data.coverImage || '',
      sortOrder: data.sortOrder || 0,
      status: 1,
    });

    return {
      id: region.id,
      regionName: region.regionName,
      regionNameEn: region.regionNameEn,
      regionType: region.regionType,
      description: region.description,
      coverImage: region.coverImage,
      sortOrder: region.sortOrder,
      status: region.status,
    };
  }

  async updateRegion(
    regionId: number,
    data: {
      regionName?: string;
      regionNameEn?: string;
      regionType?: number;
      description?: string;
      coverImage?: string;
      sortOrder?: number;
      status?: number;
    },
  ) {
    const region = await RegionInfo.findByPk(regionId);
    if (!region) {
      throw new AppError(ERROR_CODES.REGION_NOT_FOUND, '区域不存在');
    }

    if (data.regionName && data.regionName !== region.regionName) {
      const existingRegion = await RegionInfo.findOne({
        where: { regionName: data.regionName },
      });
      if (existingRegion) {
        throw new AppError(ERROR_CODES.REGION_ALREADY_EXISTS, '区域名称已存在');
      }
    }

    await region.update({
      regionName: data.regionName ?? region.regionName,
      regionNameEn: data.regionNameEn ?? region.regionNameEn,
      regionType: data.regionType ?? region.regionType,
      description: data.description ?? region.description,
      coverImage: data.coverImage ?? region.coverImage,
      sortOrder: data.sortOrder ?? region.sortOrder,
      status: data.status ?? region.status,
    });

    return {
      id: region.id,
      regionName: region.regionName,
      regionNameEn: region.regionNameEn,
      regionType: region.regionType,
      description: region.description,
      coverImage: region.coverImage,
      sortOrder: region.sortOrder,
      status: region.status,
    };
  }

  async deleteRegion(regionId: number) {
    const region = await RegionInfo.findByPk(regionId, {
      include: [
        {
          model: CountryInfo,
          as: 'countries',
          required: false,
        },
      ],
    });

    if (!region) {
      throw new AppError(ERROR_CODES.REGION_NOT_FOUND, '区域不存在');
    }

    if (region.countries && region.countries.length > 0) {
      throw new AppError(ERROR_CODES.REGION_HAS_COUNTRIES, '该区域下存在国家，无法删除');
    }

    await region.destroy();
    return { success: true };
  }

  async getAllRegions(regionType?: number) {
    const where: any = { status: 1 };
    if (regionType !== undefined) {
      where.regionType = regionType;
    }

    const regions = await RegionInfo.findAll({
      where,
      order: [['sortOrder', 'ASC'], ['id', 'ASC']],
      attributes: ['id', 'regionName', 'regionNameEn', 'regionType'],
    });

    return regions;
  }
}

export default new AdminRegionService();
