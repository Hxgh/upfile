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
          <el-table-column prop="name" label="应用名称"></el-table-column>
          <el-table-column prop="appId" label="appId"></el-table-column>
          <el-table-column prop="appKey" label="appKey"></el-table-column>
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
          <el-form-item label="应用名称">
            <el-input v-model="edit.data.name"></el-input>
          </el-form-item>
          <el-form-item label="策略ID">
            <!-- <el-input-number :min="0" v-model="edit.data.sa_id"></el-input-number> -->
            <el-select v-model="edit.data.sa_id" placeholder="请选择空间名">
              <el-option
                v-for="(it,ind) in sa_id_list"
                :label="it.name"
                :value="it.id"
                :key="ind"
              ></el-option>
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
import { applicationList, applicationDel, applicationSave } from "@/api/application.js";
import { strategyList} from "@/api/strategy.js";
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
          type: "",
          token: ""
        }
      },
      del: {
        open: false,
        data: {}
      },
      sa_id_list:'',
      token: getToken()
    };
  },
  mounted() {
    let self = this;
    self.get_list();
    self.get_sa_id_list();
  },
  methods: {
    page_change(page) {
      let self = this;
      self.list.page = page;
      self.get_list(page);
    },
    get_sa_id_list(){
      let self = this;
      strategyList({ page: '', token: self.token,type:'all' })
        .then(res => {
          if (res.code == 200) {
            self.sa_id_list = res.data || [];
          }
        })
        .catch(error => {
          Message.error(error.msg || "获取策略ID出错");
        });
    },
    get_list(page) {
      let self = this;
      self.list.page = page ? page : 1;
      self.del.open = false;
      self.edit.open = "";
      self.list.loading = true;
      applicationList({ page: page, token: self.token })
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
      applicationSave({ ...data, token: self.token })
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
      applicationDel({ token: self.token, id: id })
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
.card-box .el-input-number {
  width: 200px !important;
}
.card-box .el-input {
  width: 200px !important;
}
.card-box-head {
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px dashed #dfdfdf;
}

.card-table-expand {
  font-size: 0;
}
.card-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.card-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  min-width: 300px;
}
.card-table-expand-head {
  padding-bottom: 15px;
  border-bottom: 1px dashed #dfdfdf;
}
.card-table-expand-head span{
  font-size: 14px;
  color: #909399;
}
.card-table-expand-body {
  border-bottom: 1px dashed #dfdfdf;
}
</style>
