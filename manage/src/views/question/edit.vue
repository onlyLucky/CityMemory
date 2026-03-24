<template>
  <div class="question-edit-container">
    <div class="edit-header">
      <el-button type="primary" link @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>
        返回列表
      </el-button>
      <h2 class="page-title">{{ isEdit ? '编辑题目' : '新增题目' }}</h2>
    </div>
    
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      class="question-form"
    >
      <el-card class="form-card">
        <template #header>
          <span class="card-title">基本信息</span>
        </template>
        
        <el-form-item label="题目类型" prop="questionType">
          <el-select v-model="form.questionType" placeholder="请选择题目类型" style="width: 200px">
            <el-option label="单选题" value="single" />
            <el-option label="多选题" value="multiple" />
            <el-option label="判断题" value="boolean" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="难度" prop="difficulty">
          <el-select v-model="form.difficulty" placeholder="请选择难度" style="width: 200px">
            <el-option label="简单" :value="1" />
            <el-option label="中等" :value="2" />
            <el-option label="困难" :value="3" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="区域" prop="region">
          <el-select v-model="form.region" placeholder="请选择区域" style="width: 200px">
            <el-option v-for="region in regions" :key="region" :label="region" :value="region" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="题目内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="4"
            placeholder="请输入题目内容"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="题目图片" prop="image">
          <el-upload
            v-model:file-list="imageList"
            :auto-upload="false"
            list-type="picture-card"
            :limit="1"
            :on-preview="handlePicturePreview"
            :on-remove="handleRemoveImage"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
          <el-dialog v-model="previewVisible" title="图片预览">
            <img :src="previewImage" style="width: 100%" />
          </el-dialog>
        </el-form-item>
      </el-card>
      
      <el-card class="form-card" v-if="form.questionType !== 'boolean'">
        <template #header>
          <span class="card-title">选项设置</span>
        </template>
        
        <div v-for="(option, index) in form.options" :key="index" class="option-item">
          <el-form-item :label="`选项 ${String.fromCharCode(65 + index)}`">
            <el-input
              v-model="option.content"
              placeholder="请输入选项内容"
              style="width: 400px"
            />
            <el-checkbox v-model="option.isCorrect" style="margin-left: 10px">
              {{ form.questionType === 'multiple' ? '正确答案' : '正确答案' }}
            </el-checkbox>
            <el-button
              v-if="form.options.length > 2"
              type="danger"
              link
              style="margin-left: 10px"
              @click="handleRemoveOption(index)"
            >
              删除
            </el-button>
          </el-form-item>
        </div>
        
        <el-button
          v-if="form.options.length < 6"
          type="primary"
          link
          @click="handleAddOption"
        >
          <el-icon><Plus /></el-icon>
          添加选项
        </el-button>
      </el-card>
      
      <el-card class="form-card" v-if="form.questionType === 'boolean'">
        <template #header>
          <span class="card-title">答案设置</span>
        </template>
        
        <el-form-item label="正确答案" prop="isCorrect">
          <el-radio-group v-model="form.isCorrect">
            <el-radio :label="true">正确</el-radio>
            <el-radio :label="false">错误</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-card>
      
      <el-card class="form-card">
        <template #header>
          <span class="card-title">解析设置</span>
        </template>
        
        <el-form-item label="答案解析" prop="explanation">
          <el-input
            v-model="form.explanation"
            type="textarea"
            :rows="4"
            placeholder="请输入答案解析"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-card>
      
      <div class="form-actions">
        <el-button @click="handleBack">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          {{ isEdit ? '保存' : '提交' }}
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { questionApi } from '@/api/question'

const route = useRoute()
const router = useRouter()

const formRef = ref()
const submitting = ref(false)
const previewVisible = ref(false)
const previewImage = ref('')
const imageList = ref<any[]>([])

const isEdit = computed(() => !!route.params.id)

const form = reactive({
  id: '',
  questionType: 'single',
  difficulty: 1,
  region: '',
  content: '',
  image: '',
  options: [
    { content: '', isCorrect: false },
    { content: '', isCorrect: false },
    { content: '', isCorrect: false },
    { content: '', isCorrect: false }
  ],
  isCorrect: false,
  explanation: ''
})

const rules = {
  questionType: [{ required: true, message: '请选择题目类型', trigger: 'change' }],
  difficulty: [{ required: true, message: '请选择难度', trigger: 'change' }],
  region: [{ required: true, message: '请选择区域', trigger: 'change' }],
  content: [{ required: true, message: '请输入题目内容', trigger: 'blur' }]
}

const regions = ['北京', '上海', '广东', '江苏', '浙江', '四川', '湖北', '湖南', '山东', '河南']

const loadQuestionDetail = async () => {
  try {
    const detail = await questionApi.getDetail(route.params.id as string)
    form.id = detail.id
    form.questionType = detail.questionType
    form.difficulty = detail.difficulty
    form.region = detail.region
    form.content = detail.content
    form.image = detail.image || ''
    form.options = detail.options || []
    form.isCorrect = detail.isCorrect || false
    form.explanation = detail.explanation || ''
    
    if (form.image) {
      imageList.value = [{ name: 'image', url: form.image }]
    }
  } catch (error) {
    console.error('加载题目详情失败:', error)
    ElMessage.error('加载题目详情失败')
  }
}

const handleAddOption = () => {
  form.options.push({ content: '', isCorrect: false })
}

const handleRemoveOption = (index: number) => {
  form.options.splice(index, 1)
}

const handlePicturePreview = (file: any) => {
  previewImage.value = file.url
  previewVisible.value = true
}

const handleRemoveImage = () => {
  form.image = ''
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        const data = {
          ...form,
          image: imageList.value[0]?.url || ''
        }
        
        if (isEdit.value) {
          await questionApi.update(data)
          ElMessage.success('保存成功')
        } else {
          await questionApi.create(data)
          ElMessage.success('提交成功')
        }
        
        router.push('/question')
      } catch (error) {
        console.error('保存失败:', error)
        ElMessage.error('保存失败')
      } finally {
        submitting.value = false
      }
    }
  })
}

const handleBack = () => {
  router.push('/question')
}

onMounted(() => {
  if (isEdit.value) {
    loadQuestionDetail()
  }
})
</script>

<style scoped lang="scss">
.question-edit-container {
  padding: $spacing-lg;
  
  .edit-header {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    margin-bottom: $spacing-lg;
    
    .page-title {
      font-size: $font-size-xl;
      font-weight: 500;
      color: $text-primary;
      margin: 0;
    }
  }
  
  .question-form {
    max-width: 800px;
    
    .form-card {
      margin-bottom: $spacing-lg;
      
      .card-title {
        font-weight: 500;
        color: $text-primary;
      }
      
      .option-item {
        margin-bottom: $spacing-md;
      }
    }
    
    .form-actions {
      display: flex;
      gap: $spacing-md;
      justify-content: center;
      margin-top: $spacing-xl;
    }
  }
}
</style>
