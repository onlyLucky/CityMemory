import { Op } from 'sequelize';
import ProvinceInfo from '../../models/mysql/ProvinceInfo';
import CityInfo from '../../models/mysql/CityInfo';
import CountryInfo from '../../models/mysql/CountryInfo';
import { ERROR_CODES, AppError } from '../../constants/error';

export class AdminProvinceService {
  async getProvinceList(params: {
    page?: number;
    pageSize?: number;
    provinceName?: string;
    countryId?: number;
    status?: number;
  }) {
    const { page = 1, pageSize = 10, provinceName, countryId, status } = params;
    const offset = (page - 1) * pageSize;

    const where: any = {};
    if (provinceName) {
      where.provinceName = { [Op.like]: `%${provinceName}%` };
    }
    if (countryId !== undefined) {
      where.countryId = countryId;
    }
    if (status !== undefined) {
      where.status = status;
    }

    const { count, rows } = await ProvinceInfo.findAndCountAll({
      where,
      offset,
      limit: pageSize,
      order: [['sortOrder', 'ASC'], ['id', 'ASC']],
      include: [
        {
          model: CountryInfo,
          as: 'country',
          attributes: ['id', 'countryName'],
        },
        {
          model: CityInfo,
          as: 'cities',
          attributes: ['id', 'cityName'],
          required: false,
        },
      ],
    });

    return {
      total: count,
      page,
      pageSize,
      list: rows.map((province) => ({
        id: province.id,
        provinceName: province.provinceName,
        provinceNameEn: province.provinceNameEn,
        description: province.description,
        sortOrder: province.sortOrder,
        status: province.status,
        countryId: province.countryId,
        countryName: province.country?.countryName,
        cityCount: province.cities?.length || 0,
        createTime: province.createTime,
        updateTime: province.updateTime,
      })),
    };
  }

  async getProvinceDetail(provinceId: number) {
    const province = await ProvinceInfo.findByPk(provinceId, {
      include: [
        {
          model: CountryInfo,
          as: 'country',
          attributes: ['id', 'countryName', 'countryNameEn'],
        },
        {
          model: CityInfo,
          as: 'cities',
          attributes: ['id', 'cityName', 'cityNameEn', 'latitude', 'longitude', 'status'],
          required: false,
        },
      ],
    });

    if (!province) {
      throw new AppError(ERROR_CODES.PROVINCE_NOT_FOUND, '省份不存在');
    }

    return {
      id: province.id,
      provinceName: province.provinceName,
      provinceNameEn: province.provinceNameEn,
      description: province.description,
      sortOrder: province.sortOrder,
      status: province.status,
      countryId: province.countryId,
      country: province.country,
      cities: province.cities,
      createTime: province.createTime,
      updateTime: province.updateTime,
    };
  }

  async createProvince(data: {
    provinceName: string;
    provinceNameEn?: string;
    description?: string;
    countryId: number;
    sortOrder?: number;
  }) {
    const country = await CountryInfo.findByPk(data.countryId);
    if (!country) {
      throw new AppError(ERROR_CODES.COUNTRY_NOT_FOUND, '所属国家不存在');
    }

    const existingProvince = await ProvinceInfo.findOne({
      where: { provinceName: data.provinceName },
    });

    if (existingProvince) {
      throw new AppError(ERROR_CODES.PROVINCE_ALREADY_EXISTS, '省份名称已存在');
    }

    const province = await ProvinceInfo.create({
      provinceName: data.provinceName,
      provinceNameEn: data.provinceNameEn || '',
      description: data.description || '',
      countryId: data.countryId,
      sortOrder: data.sortOrder || 0,
      status: 1,
    });

    return {
      id: province.id,
      provinceName: province.provinceName,
      provinceNameEn: province.provinceNameEn,
      description: province.description,
      countryId: province.countryId,
      sortOrder: province.sortOrder,
      status: province.status,
    };
  }

  async updateProvince(
    provinceId: number,
    data: {
      provinceName?: string;
      provinceNameEn?: string;
      description?: string;
      countryId?: number;
      sortOrder?: number;
      status?: number;
    },
  ) {
    const province = await ProvinceInfo.findByPk(provinceId);
    if (!province) {
      throw new AppError(ERROR_CODES.PROVINCE_NOT_FOUND, '省份不存在');
    }

    if (data.countryId !== undefined && data.countryId !== province.countryId) {
      const country = await CountryInfo.findByPk(data.countryId);
      if (!country) {
        throw new AppError(ERROR_CODES.COUNTRY_NOT_FOUND, '所属国家不存在');
      }
    }

    if (data.provinceName && data.provinceName !== province.provinceName) {
      const existingProvince = await ProvinceInfo.findOne({
        where: { provinceName: data.provinceName },
      });
      if (existingProvince) {
        throw new AppError(ERROR_CODES.PROVINCE_ALREADY_EXISTS, '省份名称已存在');
      }
    }

    await province.update({
      provinceName: data.provinceName ?? province.provinceName,
      provinceNameEn: data.provinceNameEn ?? province.provinceNameEn,
      description: data.description ?? province.description,
      countryId: data.countryId ?? province.countryId,
      sortOrder: data.sortOrder ?? province.sortOrder,
      status: data.status ?? province.status,
    });

    return {
      id: province.id,
      provinceName: province.provinceName,
      provinceNameEn: province.provinceNameEn,
      description: province.description,
      countryId: province.countryId,
      sortOrder: province.sortOrder,
      status: province.status,
    };
  }

  async deleteProvince(provinceId: number) {
    const province = await ProvinceInfo.findByPk(provinceId, {
      include: [
        {
          model: CityInfo,
          as: 'cities',
          required: false,
        },
      ],
    });

    if (!province) {
      throw new AppError(ERROR_CODES.PROVINCE_NOT_FOUND, '省份不存在');
    }

    if (province.cities && province.cities.length > 0) {
      throw new AppError(ERROR_CODES.PROVINCE_HAS_CITIES, '该省份下存在城市，无法删除');
    }

    await province.destroy();
    return { success: true };
  }

  async getProvincesByCountry(countryId: number) {
    const provinces = await ProvinceInfo.findAll({
      where: { countryId, status: 1 },
      order: [['sortOrder', 'ASC'], ['id', 'ASC']],
      attributes: ['id', 'provinceName', 'provinceNameEn'],
    });

    return provinces;
  }
}

export default new AdminProvinceService();
