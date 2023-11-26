'use strict';

const Service = require('egg').Service;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class DictService extends Service {
  // list 字典类型列表
  async list(listReq) {
    const { app } = this;
    const { DictType } = app.model;

    try {
      const limit = parseInt(listReq.pageSize, 10);
      const offset = listReq.pageSize * (listReq.pageNo - 1);

      const where = {
        isDelete: 0,
        ...(listReq.dictName && { dictName: { [Op.like]: `%${listReq.dictName}%` } }),
        ...(listReq.dictType && { dictType: { [Op.like]: `%${listReq.dictType}%` } }),
        ...(listReq.dictStatus && { dictStatus: listReq.dictStatus }),
      };
      const DictTypeModel = await DictType.findAndCountAll({
        where,
        limit,
        offset,
        order: [[ 'id', 'DESC' ]],
      });

      const { count, rows } = DictTypeModel;

      const data = {
        pageNo: listReq.pageNo,
        pageSize: listReq.pageSize,
        count,
        lists: rows,
      };
      return data;
    } catch (err) {
      throw new Error(`DictService.list error: ${err}`);
    }

  }

  // all 字典类型所有
  async all() {
    const { app } = this;
    const { DictType } = app.model;

    try {
      const dictTypes = await DictType.findAll({
        where: { isDelete: 0 },
        order: [[ 'id', 'DESC' ]],
      });

      return dictTypes;
    } catch (err) {
      throw new Error(`DictService.all error: ${err}`);
    }
  }

  // add 字典类型新增
  async add(addReq) {
    const { app } = this;
    const { DictType } = app.model;
    delete addReq.id;

    try {
      const existingDictName = await DictType.findOne({
        where: { dictName: addReq.dictName, isDelete: 0 },
      });
      console.log(existingDictName, 'existingDictName....');
      if (existingDictName) {
        throw new Error('字典名称已存在！');
      }

      const existingDictType = await DictType.findOne({
        where: { dictType: addReq.dictType, isDelete: 0 },
      });
      if (existingDictType) {
        throw new Error('字典类型已存在！');
      }

      const dateTime = Math.floor(Date.now() / 1000);
      const timeObject = {
        createTime: dateTime,
        updateTime: dateTime,
      };

      const dt = await DictType.create({ ...addReq, ...timeObject });

      return dt;
    } catch (err) {
      throw new Error(`DictService.add error: ${err}`);
    }
  }

  // detail 字典类型详情
  async detail(id) {
    const { app } = this;
    const { DictType } = app.model;

    try {
      const dt = await DictType.findOne({
        where: { id, isDelete: 0 },
      });
      if (!dt) {
        throw new Error('字典类型不存在！');
      }
      return dt;
    } catch (err) {
      throw new Error(err);
    }
  }

  // edit 字典类型编辑
  async edit(editReq) {
    const { app } = this;
    const { DictType } = app.model;

    try {
      const existingDictType = await DictType.findOne({
        where: { id: editReq.id, isDelete: 0 },
      });
      if (!existingDictType) {
        throw new Error('字典类型不存在！');
      }

      const duplicateDictName = await DictType.findOne({
        where: { id: { [Op.ne]: editReq.id }, dictName: editReq.dictName, isDelete: 0 },
      });
      if (duplicateDictName) {
        throw new Error('字典名称已存在！');
      }

      const duplicateDictType = await DictType.findOne({
        where: { id: { [Op.ne]: editReq.id }, dictType: editReq.dictType, isDelete: 0 },
      });
      if (duplicateDictType) {
        throw new Error('字典类型已存在！');
      }

      await existingDictType.update(editReq);
    } catch (err) {
      throw new Error(`DictService.edit error: ${err}`);
    }
  }

  // del 字典类型删除
  async del(delReq) {
    const { app } = this;
    const { DictType } = app.model;

    try {
      const dateTime = Math.floor(Date.now() / 1000);
      await DictType.update(
        { isDelete: 1, deleteTime: dateTime },
        { where: { id: delReq.ids } }
      );
    } catch (err) {
      throw new Error(`DictService.del error: ${err}`);
    }
  }

  // List 字典数据列表
  async dataList(listReq) {
    const { app } = this;
    const { DictType, DictData } = app.model;

    try {
      const limit = parseInt(listReq.pageSize, 10);
      const offset = listReq.pageSize * (listReq.pageNo - 1);

      const dictType = await DictType.findOne({
        where: {
          dictType: listReq.dictType,
          isDelete: 0,
        },
      });

      if (!dictType) {
        throw new Error('该字典类型不存在！');
      }

      const where = {
        typeId: dictType.id,
        isDelete: 0,
        ...(listReq.name && { name: { [app.Sequelize.Op.like]: `%${listReq.name}%` } }),
        ...(listReq.value && { value: { [app.Sequelize.Op.like]: `%${listReq.value}%` } }),
        ...(listReq.status && { status: listReq.status }),
      };

      const DictDataModel = await DictData.findAndCountAll({
        where,
        limit,
        offset,
        order: [[ 'id', 'DESC' ]],
      });

      const { count, rows } = DictDataModel;

      const data = {
        pageNo: listReq.pageNo,
        pageSize: listReq.pageSize,
        count,
        lists: rows,
      };
      return data;
    } catch (err) {
      throw new Error(`DictService.dataList error: ${err}`);
    }
  }

  // all 字典数据全部
  async dataAll(allReq) {
    const { app } = this;
    const { DictType, DictData } = app.model;

    try {
      const dictType = await DictType.findOne({
        where: { dictType: allReq.dictType, isDelete: 0 },
      });
      if (!dictType) {
        throw new Error('该字典类型不存在！');
      }

      const ddModel = DictData.scope(null).findAll({
        where: { typeId: dictType.id, isDelete: 0 },
        order: [[ 'id', 'DESC' ]],
      });

      if (allReq.name) {
        ddModel.where.name = { [Op.like]: `%${allReq.name}%` };
      }
      if (allReq.value) {
        ddModel.where.value = { [Op.like]: `%${allReq.value}%` };
      }
      if (allReq.status) {
        ddModel.where.status = allReq.status;
      }

      const dictDatas = await ddModel;

      const res = dictDatas.map(dictData => dictData.toJSON());

      return res;
    } catch (err) {
      throw new Error(`DictService.dataAll error: ${err}`);
    }
  }

  // detail 字典数据详情
  async dataDetail(id) {
    const { app } = this;
    const { DictData } = app.model;

    try {
      const dictData = await DictData.findOne({
        where: { id, isDelete: 0 },
      });
      if (!dictData) {
        throw new Error('字典数据不存在！');
      }

      return dictData;
    } catch (err) {
      throw new Error(`DictService.dataDetail error: ${err}`);
    }
  }

  // add 字典数据新增
  async dataAdd(addReq) {
    const { app } = this;
    const { DictData } = app.model;
    delete addReq.id;

    try {
      const existingDictData = await DictData.findOne({
        where: { name: addReq.name, isDelete: 0 },
      });
      if (existingDictData) {
        throw new Error('字典数据已存在！');
      }

      const newDictData = await DictData.create(addReq);
      return newDictData;
    } catch (err) {
      throw new Error(`DictService.dataAdd error: ${err}`);
    }
  }

  // edit 字典数据编辑
  async dataEdit(editReq) {
    const { app } = this;
    const { DictData } = app.model;

    try {
      const existingDictData = await DictData.findOne({
        where: { id: editReq.id, isDelete: 0 },
      });
      if (!existingDictData) {
        throw new Error('字典数据不存在！');
      }

      const duplicateDictData = await DictData.findOne({
        where: { id: { [Op.ne]: editReq.id }, name: editReq.name, isDelete: 0 },
      });
      if (duplicateDictData) {
        throw new Error('字典数据已存在！');
      }

      await existingDictData.update(editReq);
    } catch (err) {
      throw new Error(`DictService.dataEdit error: ${err}`);
    }
  }

  // del 字典数据删除
  async dataDel(delReq) {
    const { app } = this;
    const { DictData } = app.model;

    try {
      const dateTime = Math.floor(Date.now() / 1000);
      await DictData.update(
        { isDelete: 1, deleteTime: dateTime },
        { where: { id: delReq.ids } }
      );
    } catch (err) {
      throw new Error(`DictService.del error: ${err}`);
    }
  }
}


module.exports = DictService;
