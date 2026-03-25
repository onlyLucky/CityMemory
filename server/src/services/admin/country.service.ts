import { Op } from 'sequelize';
import CountryInfo from '../../models/mysql/CountryInfo';
import ProvinceInfo from '../../models/mysql/ProvinceInfo';
import RegionInfo from '../../models/mysql/RegionInfo';
import { ERROR_CODES, AppError } from '../../constants/error';

export class AdminCountryService {
  async getCountryList(params: {
    page?: number;
    pageSize?: number;
    countryName?: string;
    regionId?: number;
    status?: number;
  }) {
    const { page = 1, pageSize = 10, countryName, regionId, status } = params;
    const offset = (page - 1) * pageSize;

    const where: any = {};
    if (countryName) {
      where.countryName = { [Op.like]: `%${countryName}%` };
    }
    if (regionId !== undefined) {
      where.regionId = regionId;
    }
    if (status !== undefined) {
      where.status = status;
    }

    const { count, rows } = await CountryInfo.findAndCountAll({
      where,
      offset,
      limit: pageSize,
      order: [['sortOrder', 'ASC'], ['id', 'ASC']],
      include: [
        {
          model: RegionInfo,
          as: 'region',
          attributes: ['id', 'regionName'],
        },
        {
          model: ProvinceInfo,
          as: 'provinces',
          attributes: ['id', 'provinceName'],
          required: false,
        },
      ],
    });

    return {
      total: count,
      page,
      pageSize,
      list: rows.map((country) => ({
        id: country.id,
        countryName: country.countryName,
        countryNameEn: country.countryNameEn,
        countryCode: country.countryCode,
        flagImage: country.flagImage,
        description: country.description,
        sortOrder: country.sortOrder,
        status: country.status,
        regionId: country.regionId,
        regionName: country.region?.regionName,
        provinceCount: country.provinces?.length || 0,
        createTime: country.createTime,
        updateTime: country.updateTime,
      })),
    };
  }

  async getCountryDetail(countryId: number) {
    const country = await CountryInfo.findByPk(countryId, {
      include: [
        {
          model: RegionInfo,
          as: 'region',
          attributes: ['id', 'regionName', 'regionNameEn'],
        },
        {
          model: ProvinceInfo,
          as: 'provinces',
          attributes: ['id', 'provinceName', 'provinceNameEn', 'status'],
          required: false,
        },
      ],
    });

    if (!country) {
      throw new AppError(ERROR_CODES.COUNTRY_NOT_FOUND, '国家不存在');
    }

    return {
      id: country.id,
      countryName: country.countryName,
      countryNameEn: country.countryNameEn,
      countryCode: country.countryCode,
      flagImage: country.flagImage,
      description: country.description,
      sortOrder: country.sortOrder,
      status: country.status,
      regionId: country.regionId,
      region: country.region,
      provinces: country.provinces,
      createTime: country.createTime,
      updateTime: country.updateTime,
    };
  }

  async createCountry(data: {
    countryName: string;
    countryNameEn?: string;
    countryCode?: string;
    flagImage?: string;
    description?: string;
    regionId: number;
    sortOrder?: number;
  }) {
    const region = await RegionInfo.findByPk(data.regionId);
    if (!region) {
      throw new AppError(ERROR_CODES.REGION_NOT_FOUND, '所属区域不存在');
    }

    const existingCountry = await CountryInfo.findOne({
      where: { countryName: data.countryName },
    });

    if (existingCountry) {
      throw new AppError(ERROR_CODES.COUNTRY_ALREADY_EXISTS, '国家名称已存在');
    }

    const country = await CountryInfo.create({
      countryName: data.countryName,
      countryNameEn: data.countryNameEn || '',
      countryCode: data.countryCode || '',
      flagImage: data.flagImage || '',
      description: data.description || '',
      regionId: data.regionId,
      sortOrder: data.sortOrder || 0,
      status: 1,
    });

    return {
      id: country.id,
      countryName: country.countryName,
      countryNameEn: country.countryNameEn,
      countryCode: country.countryCode,
      flagImage: country.flagImage,
      description: country.description,
      regionId: country.regionId,
      sortOrder: country.sortOrder,
      status: country.status,
    };
  }

  async updateCountry(
    countryId: number,
    data: {
      countryName?: string;
      countryNameEn?: string;
      countryCode?: string;
      flagImage?: string;
      description?: string;
      regionId?: number;
      sortOrder?: number;
      status?: number;
    },
  ) {
    const country = await CountryInfo.findByPk(countryId);
    if (!country) {
      throw new AppError(ERROR_CODES.COUNTRY_NOT_FOUND, '国家不存在');
    }

    if (data.regionId !== undefined && data.regionId !== country.regionId) {
      const region = await RegionInfo.findByPk(data.regionId);
      if (!region) {
        throw new AppError(ERROR_CODES.REGION_NOT_FOUND, '所属区域不存在');
      }
    }

    if (data.countryName && data.countryName !== country.countryName) {
      const existingCountry = await CountryInfo.findOne({
        where: { countryName: data.countryName },
      });
      if (existingCountry) {
        throw new AppError(ERROR_CODES.COUNTRY_ALREADY_EXISTS, '国家名称已存在');
      }
    }

    await country.update({
      countryName: data.countryName ?? country.countryName,
      countryNameEn: data.countryNameEn ?? country.countryNameEn,
      countryCode: data.countryCode ?? country.countryCode,
      flagImage: data.flagImage ?? country.flagImage,
      description: data.description ?? country.description,
      regionId: data.regionId ?? country.regionId,
      sortOrder: data.sortOrder ?? country.sortOrder,
      status: data.status ?? country.status,
    });

    return {
      id: country.id,
      countryName: country.countryName,
      countryNameEn: country.countryNameEn,
      countryCode: country.countryCode,
      flagImage: country.flagImage,
      description: country.description,
      regionId: country.regionId,
      sortOrder: country.sortOrder,
      status: country.status,
    };
  }

  async deleteCountry(countryId: number) {
    const country = await CountryInfo.findByPk(countryId, {
      include: [
        {
          model: ProvinceInfo,
          as: 'provinces',
          required: false,
        },
      ],
    });

    if (!country) {
      throw new AppError(ERROR_CODES.COUNTRY_NOT_FOUND, '国家不存在');
    }

    if (country.provinces && country.provinces.length > 0) {
      throw new AppError(ERROR_CODES.COUNTRY_HAS_PROVINCES, '该国家下存在省份，无法删除');
    }

    await country.destroy();
    return { success: true };
  }

  async getCountriesByRegion(regionId: number) {
    const countries = await CountryInfo.findAll({
      where: { regionId, status: 1 },
      order: [['sortOrder', 'ASC'], ['id', 'ASC']],
      attributes: ['id', 'countryName', 'countryNameEn', 'countryCode'],
    });

    return countries;
  }
}

export default new AdminCountryService();
