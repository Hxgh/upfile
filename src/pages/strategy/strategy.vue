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
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-form label-position="left" inline class="card-table-expand">
                <div class="card-table-expand-head">
                  <span>上传目标</span>
                </div>
                <div v-for="(i,k) in scope.row.server_link" :key="k">
                  <div class="card-table-expand-body">
                    <el-form-item label="空间名">
                      <span v-text="i.bucket"></span>
                    </el-form-item>
                    <el-form-item label="前缀">
                      <span v-text="i.prefix"></span>
                    </el-form-item>
                    <el-form-item label="比例">
                      <span v-text="i.radio"></span>
                    </el-form-item>
                    <el-form-item label="域名">
                      <span v-text="i.url"></span>
                    </el-form-item>
                    <el-form-item label="默认">
                      <span v-text="i.default"></span>
                    </el-form-item>
                  </div>
                </div>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="策略名称"></el-table-column>
          <el-table-column prop="frequency" label="频率"></el-table-column>
          <el-table-column prop="space" label="使用空间"></el-table-column>
          <el-table-column prop="file_size" label="文件大小"></el-table-column>
          <el-table-column prop="name_rule" label="命名规则"></el-table-column>
          <el-table-column prop="type" label="业务类型"></el-table-column>
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
      <div v-if="edit.open != ''" class="target">
        <el-form ref="form" :model="edit.data" label-width="130px">
          <el-form-item label="策略名称">
            <el-input v-model="edit.data.name"></el-input>
          </el-form-item>
          <el-form-item label="频率(Hz)">
            <el-input-number
              v-model="edit.data.frequency"
              :min="50"
              :max="500"
              :step="50"
              label="请选择频率"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="使用空间(GB)">
            <el-input-number
              v-model="edit.data.space"
              :min="50"
              :max="500"
              :step="50"
              label="请选择使用空间"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="文件大小(MB)">
            <el-input-number
              v-model="edit.data.file_size"
              :min="50"
              :max="500"
              :step="50"
              label="请选择文件大小"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="命名规则">
            <el-input v-model="edit.data.name_rule"></el-input>
          </el-form-item>
          <el-form-item label="上传目标:">
            <div style="position:absolute;">
              <el-button
                icon="el-icon-plus"
                @click="server_add"
                size="mini"
                circle
                class="server-box-add"
              ></el-button>
              <div 
                class="setDefault" 
                @click="setdefault"
                :class="edit.data.server_link[edit.server_link_act].default==0?'setDefaulttrue':''" 
              >设为默认</div>
            </div>
            <div class="server-box">
              
              <el-tabs v-model="edit.server_link_act" @tab-remove="server_del">
                <el-tab-pane
                  v-for="(i,k) in edit.data.server_link"
                  :key="k"
                  :label="`目标${k+1}${i.default==1?'(默认)':''}`"
                  :name="k.toString()"
                  :ref="i.name"
                  :closable="edit.data.server_link.length>1"
                >
                  <div>
                    <!-- <el-form-item :label="`目标${k+1}`">
                      <el-button
                        size="mini"
                        @click.stop="server_del"
                        type="danger"
                        icon="el-icon-delete"
                        circle
                        v-if="k > 0"
                      ></el-button>
                    </el-form-item>-->
                    <el-form-item label="服务商">
                      <el-select
                        v-model="i.server_id"
                        placeholder="请选择服务商"
                        @change="i.bucket = '',i.url = ''"
                      >
                        <el-option
                          v-for="(ii,kk) in edit.server_data"
                          :label="ii.name"
                          :value="ii.server_id"
                          :key="kk"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="空间名">
                      <el-select v-model="i.bucket" placeholder="请选择空间名" @change="i.url = ''">
                        <div v-if="edit.server_data">
                          <div v-for="(ii,kk) in edit.server_data" :key="kk">
                            <div v-if="ii.server_id == i.server_id">
                              <el-option
                                v-for="(iii,kkk) in ii.children"
                                :label="iii.name"
                                :value="iii.name"
                                :key="kkk"
                              ></el-option>
                            </div>
                          </div>
                        </div>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="域名">
                      <el-select v-model="i.url" placeholder="请选择域名">
                        <div v-if="edit.server_data">
                          <div v-for="(ii,kk) in edit.server_data" :key="kk">
                            <div v-if="ii.server_id == i.server_id && ii.children">
                              <div v-for="(iii,kkk) in ii.children" :key="kkk">
                                <div v-if="iii.name == i.bucket && iii.children">
                                  <el-option
                                    v-for="(iiii,kkkk) in iii.children"
                                    :label="iiii"
                                    :value="iiii"
                                    :key="kkkk"
                                  ></el-option>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="前缀">
                      <el-input v-model="i.prefix"></el-input>
                    </el-form-item>
                    <el-form-item label="比例">
                      <el-input v-model="i.radio"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="是否默认">
                      <el-radio v-model="i.default" label="1">是</el-radio>
                      <el-radio v-model="i.default" label="0">否</el-radio>
                    </el-form-item> -->
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
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
import {
  strategyList,
  strategyDel,
  strategySave,
  strategyTree
} from "@/api/strategy.js";
import { getToken } from "@/utils/public";
import { clone } from "@/utils/tools";
import { Message } from "element-ui";
export default {
  data() {
    return {
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
          frequency: "",
          space: "",
          file_size: "",
          name_rule: "",
          type: "",
          token: getToken,
          server_link: [
            {
              server_id: "",
              bucket: "",
              prefix: "",
              radio: "",
              url: "",
              default: 0
            }
          ]
        },
        server_link_act: "0",
        server_data: []
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
    setdefault(){
      let self=this;
      let data = self.edit.data.server_link;
      for(var i in data){
        if(i==self.edit.server_link_act){
          data[i].default=1;
        }else{
          data[i].default=0;
        }
      }
      self.$set(self.edit.data,'server_link',data);
    },
    server_add() {
      let self = this;
      let data = self.edit.data.server_link;
      data.push(clone(self.edit.new.server_link[0]));
      self.edit.server_link_act = (data.length - 1).toString();
    },
    server_del(index) {
      let self = this;
      let data = self.edit.data.server_link;
      let act = self.edit.server_link_act;
      data.splice(index, 1);
      if (act == index) {
        self.edit.server_link_act = (data.length - 1).toString();
      }else if(act > index){
        self.edit.server_link_act = (self.edit.server_link_act - 1).toString();
      }
    },
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
      //获取list
      strategyList({ page: page, token: self.token })
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
      //获取服务商tree
      strategyTree({ token: self.token })
        .then(res => {
          if (res.code == 200) {
            self.edit.server_data = res.data || [];
          }
        })
        .catch(error => {
          Message.error(error.msg || "获取服务商列表出错");
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
      //处理上传目标文件
      self.edit.server_link_act = "0";
    },
    save_data() {
      let self = this;
      let data = self.edit.data;
      strategySave({ ...data, token: self.token })
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
      strategyDel({ token: self.token, id: id })
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
.setDefault{
  color:#b4b4b4;
  width: 80px;
  margin-left: 50px;
}
.setDefaulttrue{
   color:#409eff;
}
.setDefaulttrue:hover{
  cursor:pointer;
}
.card-box {
  margin: 20px;
}
.card-box .el-input {
  width: 200px !important;
}
.card-box .el-input-number {
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
.card-table-expand-head span {
  font-size: 14px;
  color: #909399;
}
.card-table-expand-body {
  border-bottom: 1px dashed #dfdfdf;
}
.server-box {
  position: relative;
  margin-top: 50px;
}
.server-box-add {
  position: absolute;
  z-index: 10;
  left: 0px;
  top: 7px;
}
.target .el-form-item__content{
  margin-bottom: 20px;
}
</style>
