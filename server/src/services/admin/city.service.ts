import { Op } from 'sequelize';
import CityInfo from '../../models/mysql/CityInfo';
import ProvinceInfo from '../../models/mysql/ProvinceInfo';
import { ERROR_CODES, AppError } from '../../constants/error';
import { logger } from '../../config/logger';

interface CityImportData {
  cityName: string;
  cityNameEn?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  provinceId: number;
  sortOrder?: number;
}

interface ImportProgress {
  total: number;
  success: number;
  failed: number;
  errors: Array<{ row: number; message: string }>;
}

let importProgressMap = new Map<string, ImportProgress>();

export class AdminCityService {
  async getCityList(params: {
    page?: number;
    pageSize?: number;
    cityName?: string;
    provinceId?: number;
    status?: number;
  }) {
    const { page = 1, pageSize = 10, cityName, provinceId, status } = params;
    const offset = (page - 1) * pageSize;

    const where: any = {};
    if (cityName) {
      where.cityName = { [Op.like]: `%${cityName}%` };
    }
    if (provinceId !== undefined) {
      where.provinceId = provinceId;
    }
    if (status !== undefined) {
      where.status = status;
    }

    const { count, rows } = await CityInfo.findAndCountAll({
      where,
      offset,
      limit: pageSize,
      order: [['sortOrder', 'ASC'], ['id', 'ASC']],
      include: [
        {
          model: ProvinceInfo,
          as: 'province',
          attributes: ['id', 'provinceName'],
        },
      ],
    });

    return {
      total: count,
      page,
      pageSize,
      list: rows.map((city) => ({
        id: city.id,
        cityName: city.cityName,
        cityNameEn: city.cityNameEn,
        description: city.description,
        latitude: city.latitude,
        longitude: city.longitude,
        sortOrder: city.sortOrder,
        status: city.status,
        provinceId: city.provinceId,
        provinceName: city.province?.provinceName,
        createTime: city.createTime,
        updateTime: city.updateTime,
      })),
    };
  }

  async getCityDetail(cityId: number) {
    const city = await CityInfo.findByPk(cityId, {
      include: [
        {
          model: ProvinceInfo,
          as: 'province',
          attributes: ['id', 'provinceName', 'provinceNameEn'],
        },
      ],
    });

    if (!city) {
      throw new AppError(ERROR_CODES.CITY_NOT_FOUND, '城市不存在');
    }

    return {
      id: city.id,
      cityName: city.cityName,
      cityNameEn: city.cityNameEn,
      description: city.description,
      latitude: city.latitude,
      longitude: city.longitude,
      sortOrder: city.sortOrder,
      status: city.status,
      provinceId: city.provinceId,
      province: city.province,
      createTime: city.createTime,
      updateTime: city.updateTime,
    };
  }

  async createCity(data: {
    cityName: string;
    cityNameEn?: string;
    description?: string;
    latitude?: number;
    longitude?: number;
    provinceId: number;
    sortOrder?: number;
  }) {
    const province = await ProvinceInfo.findByPk(data.provinceId);
    if (!province) {
      throw new AppError(ERROR_CODES.PROVINCE_NOT_FOUND, '所属省份不存在');
    }

    const existingCity = await CityInfo.findOne({
      where: { cityName: data.cityName, provinceId: data.provinceId },
    });

    if (existingCity) {
      throw new AppError(ERROR_CODES.CITY_ALREADY_EXISTS, '该省份下城市名称已存在');
    }

    const city = await CityInfo.create({
      cityName: data.cityName,
      cityNameEn: data.cityNameEn || '',
      description: data.description || '',
      latitude: data.latitude || 0,
      longitude: data.longitude || 0,
      provinceId: data.provinceId,
      sortOrder: data.sortOrder || 0,
      status: 1,
    });

    return {
      id: city.id,
      cityName: city.cityName,
      cityNameEn: city.cityNameEn,
      description: city.description,
      latitude: city.latitude,
      longitude: city.longitude,
      provinceId: city.provinceId,
      sortOrder: city.sortOrder,
      status: city.status,
    };
  }

  async updateCity(
    cityId: number,
    data: {
      cityName?: string;
      cityNameEn?: string;
      description?: string;
      latitude?: number;
      longitude?: number;
      provinceId?: number;
      sortOrder?: number;
      status?: number;
    },
  ) {
    const city = await CityInfo.findByPk(cityId);
    if (!city) {
      throw new AppError(ERROR_CODES.CITY_NOT_FOUND, '城市不存在');
    }

    if (data.provinceId !== undefined && data.provinceId !== city.provinceId) {
      const province = await ProvinceInfo.findByPk(data.provinceId);
      if (!province) {
        throw new AppError(ERROR_CODES.PROVINCE_NOT_FOUND, '所属省份不存在');
      }
    }

    if (data.cityName && data.cityName !== city.cityName) {
      const existingCity = await CityInfo.findOne({
        where: {
          cityName: data.cityName,
          provinceId: data.provinceId ?? city.provinceId,
        },
      });
      if (existingCity) {
        throw new AppError(ERROR_CODES.CITY_ALREADY_EXISTS, '该省份下城市名称已存在');
      }
    }

    await city.update({
      cityName: data.cityName ?? city.cityName,
      cityNameEn: data.cityNameEn ?? city.cityNameEn,
      description: data.description ?? city.description,
      latitude: data.latitude ?? city.latitude,
      longitude: data.longitude ?? city.longitude,
      provinceId: data.provinceId ?? city.provinceId,
      sortOrder: data.sortOrder ?? city.sortOrder,
      status: data.status ?? city.status,
    });

    return {
      id: city.id,
      cityName: city.cityName,
      cityNameEn: city.cityNameEn,
      description: city.description,
      latitude: city.latitude,
      longitude: city.longitude,
      provinceId: city.provinceId,
      sortOrder: city.sortOrder,
      status: city.status,
    };
  }

  async deleteCity(cityId: number) {
    const city = await CityInfo.findByPk(cityId);

    if (!city) {
      throw new AppError(ERROR_CODES.CITY_NOT_FOUND, '城市不存在');
    }

    await city.destroy();
    return { success: true };
  }

  async batchImportCities(importId: string, cities: CityImportData[]) {
    importProgressMap.set(importId, {
      total: cities.length,
      success: 0,
      failed: 0,
      errors: [],
    });

    for (let i = 0; i < cities.length; i++) {
      const cityData = cities[i];
      try {
        const province = await ProvinceInfo.findByPk(cityData.provinceId);
        if (!province) {
          throw new Error('所属省份不存在');
        }

        const existingCity = await CityInfo.findOne({
          where: { cityName: cityData.cityName, provinceId: cityData.provinceId },
        });

        if (existingCity) {
          await existingCity.update({
            cityNameEn: cityData.cityNameEn ?? existingCity.cityNameEn,
            description: cityData.description ?? existingCity.description,
            latitude: cityData.latitude ?? existingCity.latitude,
            longitude: cityData.longitude ?? existingCity.longitude,
            sortOrder: cityData.sortOrder ?? existingCity.sortOrder,
          });
        } else {
          await CityInfo.create({
            cityName: cityData.cityName,
            cityNameEn: cityData.cityNameEn || '',
            description: cityData.description || '',
            latitude: cityData.latitude || 0,
            longitude: cityData.longitude || 0,
            provinceId: cityData.provinceId,
            sortOrder: cityData.sortOrder || 0,
            status: 1,
          });
        }

        const progress = importProgressMap.get(importId)!;
        progress.success++;
      } catch (error: any) {
        const progress = importProgressMap.get(importId)!;
        progress.failed++;
        progress.errors.push({
          row: i + 1,
          message: error.message || '导入失败',
        });
        logger.error(`导入城市失败: 第${i + 1}行`, error);
      }
    }

    return importProgressMap.get(importId);
  }

  getImportProgress(importId: string): ImportProgress | undefined {
    return importProgressMap.get(importId);
  }

  async getCitiesByProvince(provinceId: number) {
    const cities = await CityInfo.findAll({
      where: { provinceId, status: 1 },
      order: [['sortOrder', 'ASC'], ['id', 'ASC']],
      attributes: ['id', 'cityName', 'cityNameEn', 'latitude', 'longitude'],
    });

    return cities;
  }
}

export default new AdminCityService();
