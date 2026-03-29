<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'

onLaunch(() => {
  const userStore = useUserStore()
  userStore.initUserState()
})

onShow(() => {
})

onHide(() => {
})
</script>

<style lang="scss">
@use '@/styles/reset.scss';
@use '@/styles/common.scss';

page {
  background-color: $color-bg-page;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: $font-size-base;
  color: $color-text-primary;
  line-height: 1.5;
}

::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
  background: transparent;
}

button {
  margin: 0;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 0;
  line-height: inherit;
  
  &::after {
    display: none;
  }
}

input, textarea {
  box-sizing: border-box;
}

view, text {
  box-sizing: border-box;
}
</style>
