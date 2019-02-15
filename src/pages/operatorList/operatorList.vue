<template>
  <div>
    <el-card shadow="never" class="card-box">
      <div v-if="edit.open == ''">
        <div class="card-box-head">
          <el-button type="primary" @click.stop="new_data">新增</el-button>
        </div>
        <el-table
          ref="multipleTable"
          v-loading="list.loading"
          :data="list.data"
          :stripe="true"
          tooltip-effect="dark"
          max-height="600"
        >
          <el-table-column prop="name" label="名称" width="100"></el-table-column>
          <el-table-column label="服务商">
            <template slot-scope="scope">
              <span v-text="scope.row.type == 1 ? '七牛云' : scope.row.type == 2 ? '腾讯云' : ''"></span>
            </template>
          </el-table-column>
          <el-table-column prop="secret_key_encry" label="secret_key"></el-table-column>
          <el-table-column prop="access_key_encry" label="access_key"></el-table-column>
          <el-table-column label="操作" fixed="right" width="150">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" plain @click.stop="edit_data(scope.row)">编辑</el-button>
              <el-button type="danger" size="mini" plain @click.stop="del_dialog(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-if="list.total > 20"
          background
          layout="prev, pager, next"
          :page-size="list.size"
          :total="list.total"
          :current-page="list.page"
          @current-change="page_change"
        ></el-pagination>
      </div>
      <div v-if="edit.open != ''">
        <el-form ref="form" :model="edit.data" label-width="80px">
          <el-form-item label="名称">
            <el-input v-model="edit.data.name"></el-input>
          </el-form-item>
          <el-form-item label="access_key">
            <el-input v-model="edit.data.access_key"></el-input>
          </el-form-item>
          <el-form-item label="secret_key">
            <el-input v-model="edit.data.secret_key"></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="edit.data.type" placeholder="请选择类型">
              <el-option label="七牛云" value="1"></el-option>
              <el-option label="腾讯云" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="edit.open = ''">取消</el-button>
            <el-button type="primary" @click="save_data" v-text="edit.open"></el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-dialog :title="`确定删除${del.data.name}`" :visible.sync="del.open" width="30%" show-close>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="text" @click="del.open = false">取消</el-button>
        <el-button type="primary" size="mini" slot="reference" @click.stop="del_data()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { operatorList, operatorDel, operatorSave } from "@/api/operator.js";
import { getToken } from "@/utils/public";
import { clone } from "@/utils/tools";
import { Message } from "element-ui";
export default {
  data() {
    return {
      visible2: 1,
      list: {
        data: [],
        total: 0,
        page: 1,
        size: ""
      },
      edit: {
        open: false,
        data: {},
        new: {
          name: "",
          access_key: "",
          secret_key: "",
          type: "",
          token: ""
        }
      },
      del: {
        open: false,
        data: {}
      },
      token: getToken()
    };
  },
  mounted() {
    let self = this;
    self.get_list();
  },
  methods: {
    page_change(page) {
      let self = this;
      self.list.page = page;
      self.get_list(page);
    },
    get_list(page) {
      let self = this;
      self.list.page = page ? page : 1;
      self.del.open = false;
      self.edit.open = "";
      self.list.loading = true;
      operatorList({ page: page, token: self.token })
        .then(res => {
          if (res.code == 200) {
            self.list.data = res.data.data || [];
            self.list.total = res.data.count || 0;
          }
          self.list.loading = false;
        })
        .catch(error => {
          Message.error(error.msg || "获取列表出错");
          self.list.loading = false;
        });
    },
    edit_data(data) {
      let self = this;
      self.edit.data = clone(data);
      self.edit.open = "修改";
    },
    new_data() {
      let self = this;
      self.edit.data = clone(self.edit.new);
      self.edit.open = "新增";
    },
    save_data() {
      let self = this;
      let data = self.edit.data;
      operatorSave({ ...data, token: self.token })
        .then(res => {
          if (res.code == 200) {
            Message.success(`${self.edit.open}成功`);
            self.get_list();
          } else {
            Message.warning(res.msg || `${self.edit.open}出错`);
          }
        })
        .catch(error => {
          Message.error(error.msg || `${self.edit.open}失败`);
        });
    },
    del_dialog(data) {
      let self = this;
      self.del.data = data;
      self.del.open = true;
    },
    del_data() {
      let self = this;
      let data = self.del.data;
      let id = data.id;
      self.del.open = false;
      operatorDel({ token: self.token, id: id })
        .then(res => {
          if (res.code == 200) {
            Message.success("删除成功");
          } else {
            Message.warning(res.msg || "删除出错");
            self.del.open = true;
          }
          self.get_list();
        })
        .catch(error => {
          Message.error(error.msg || "删除失败");
          self.del.open = true;
        });
    }
  }
};
</script>

<style lang="less">
.card-box {
  margin: 20px;
}
.card-box .el-input {
  width: 200px !important;
}
.card-box-head {
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px dashed #dfdfdf;
}
</style>
