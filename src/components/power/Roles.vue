<template>
  <div>
    <!-- 面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图-->
    <el-card>
      <!-- 添加角色按钮区域-->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible=true">添加角色</el-button>
        </el-col>
      </el-row>

      <!--角色列表区域-->
      <el-table :data="roleList" border stripe>
        <!--展开列-->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom',i1 === 0 ? 'bdtop' :'','vcenter']" v-for="(item1, i1) in scope.row.children"
                    :key="item1.id">
              <!--渲染一级权限-->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--渲染二级和三级权限-->
              <el-col :span="19">
                <!--通过for循环嵌套渲染二级权限-->
                <el-row :class="[i2 ===0 ? '' : 'bdtop','vcenter']" v-for="(item2,i2) in item1.children"
                        :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row , item2.id)">{{
                        item2.authName
                      }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>

                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="(item3,i3) in item2.children" :key="item3.id" closable
                            @close="removeRightById(scope.row,item3.id)">
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <pre></pre>

          </template>
        </el-table-column>
        <!--索引列-->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRoleById(scope.row.id)">删除
            </el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限
            </el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-card>
    <!--分配权限的对话框-->
    <el-dialog
        title="提示"
        :visible.sync="setRightDialogVisable"
        width="50%" @close="setRightDialogClosed">
      <!--树形控件-->
      <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" default-expand-all
               :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisable = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
    </el-dialog>

    <!--    添加用户的对话框-->
    <el-dialog
        title="添加角色"
        :visible.sync="addDialogVisible"
        width="50%" @close="addDialogClosed">
      <!--      内容主体区域-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!--      底部区域-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRole">确 定</el-button>
  </span>
    </el-dialog>

    <!--    修改角色列表的对话框-->
    <el-dialog
        title="角色编辑"
        :visible.sync="editDialogVisible"
        width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editRoleInfo">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    //验证角色描述的验证规则
    let chekcroleName = (rule, value, cb) => {
      const regroleName = /^\w+@\w+(\.\w+)+$/
      if (regroleName.test(value)) {
        //合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的角色名称'))
    }
    let checkroleDesc = (rule, value, cb) => {
      const regroleDesc = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regroleDesc.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的角色描述'))
    }
    return {
      //添加角色的验证规则对象
      addFormRules: {
        roleName: [
          {required: true, message: '请输入角色的名称', trigger: 'blur'},
          {min: 3, max: 10, message: '角色名称的长度在3-10个字符之间'},
          // {validator:chekcroleName,trigger: "blur" }
        ],
        roleDesc: [
          {required: true, message: '请输入角色的描述', trigger: 'blur'},
          {min: 3, max: 10, message: '角色的描述的长度在3-10个字符之间'},
          // {validator:chekcroleName,trigger: "blur" }
        ]

      },
      //添加角色的表单数据
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      //控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      //所有角色列表数据
      roleList: [],
      //控制分配权限对话框的显示与隐藏
      setRightDialogVisable: false,
      //所有权限的数据
      rightslist: [],

      //树型控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      //默认选中的节点ID值数组
      defKeys: [],
      //当前即将分配权限的角色ID
      roleId: '',
      //控制修改角色列表对话框显示与隐藏
      editDialogVisible: false,
      //查询到的角色信息对象
      editForm: {},
      //修改角色列表的验证规则对象
      editFormRules: {
        roleName: [
          {required: true, message: '请输入角色的名称', trigger: 'blur'},
          // {validate: chekcroleName, trigger: "blur"}
        ],
        roleDesc: [
          {required: true, message: '请输入角色描述', trigger: 'blur'},
          // {validate: checkroleDesc, trigger: "blur"}

        ]
      }
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const {data: res} = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.roleList = res.data

      console.log(this.roleList)
    },
    // editUserInfo() {
    //   this.$refs.editFormRef.validate(async valid => {
    //     // console.log(valid)
    //     if (!valid) return
    //     // 发起修改用户信息的数据请求
    //     const {data: res} = await this.$http.put('users/' +
    //         this.editForm.id, {
    //       email: this.editForm.email,
    //       mobile: this.editForm.mobile
    //     })
    //     if (res.meta.status !== 200) {
    //       return this.$message.error('更新用户信息失败')
    //     }
    //     //关闭对话框
    //     this.editDialogVisible = false
    //     //刷新数据列表
    //     this.getUserList()
    //     //提升修改成功
    //     this.$message.success('更新用户信息成功')
    //   })
    // },
//点击按钮添加新角色
    addRole() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        //可以发起添加角色的网络请求
        const {data: res} = await this.$http.post('roles', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加角色失败')
        }
        this.$message.success('添加角色成功')
        //隐藏添加角色的对话框
        this.addDialogVisible = false,
            //重新获取角色列表数据
            this.getRolesList()
      })
    },

    //展示编辑角色列表用户的对话框
    async showEditDialog(id) {
      //console.log(id)
      const {data: res} = await this.$http.get('roles/' + id)

      if (res.meta.status !== 200) {
        return this.$message.error('查询角色信息失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },


    //监听修改角色列表的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },


    //修改角色信息并提交
    editRoleInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        //发起修改角色列表的数据请求
        const {data: res} = await this.$http.put('roles/' + this.editForm.roleId, {
          roleName: this.editForm.roleName,
          roleDesc: this.editForm.roleDesc
        })
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('更新角色信息失败')
        }
        //关闭对话框
        this.editDialogVisible = false
        //刷新数据列表
        this.getRolesList()
        //提升修改成功
        this.$message.success('更新角色信息成功')
      })
    },

    //监听添加角色的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },

    async removeRoleById(id) {
      //根据ID删除对应的角色信息
      // console.log(id)
      //弹框询问角色是否删除数据
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      //如果角色确认删除，则返回值为字符串 confirm
      //如果角色取消了删除，则返回值为字符串 cancel
      //  console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      const {data: res} = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      this.getRolesList()
    },


    //根据ID删除对应的权限
    async removeRightById(role, rightId) {
      //弹框提升用户是否要删除
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败!')
      }
      //this.getRolesList()
      role.children = res.data
    },
    //展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      //获取所有权限的数据
      const {data: res} = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      //获取到的权限数据保存到 data中
      this.rightslist = res.data

      console.log(this.rightslist)

      //递归获取三级节点的id
      this.getLeafKeys(role, this.defKeys)

      this.setRightDialogVisable = true
    },
    //通过递归的形式，获取角色下所有三级权限的id,并保存到defKeys数组中
    getLeafKeys(node, arr) {
      if (!node.children) {
        //如果当前node节点不包含children属性，则是三级节点
        return arr.push(node.id)
      }
      node.children.forEach(item =>
          this.getLeafKeys(item, arr))

    },
    //监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = []
    },
    //点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()]
      const idStr = keys.join(',')
      const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`, {rids: idStr})
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败!')
      }
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRightDialogVisable = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>