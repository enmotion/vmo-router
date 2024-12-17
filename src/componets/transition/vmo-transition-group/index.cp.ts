import { defineAsyncComponent } from 'vue';
const component = defineAsyncComponent(() => import('./component.vue'));
export default component;