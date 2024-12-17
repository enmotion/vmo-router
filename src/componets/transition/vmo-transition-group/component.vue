<template>
  <div 
    class="aq-transition-group"
    :style="{
      '--itemdisplay':itemDisplay,
      '--enter':transDuration.enter,
      '--leave':transDuration.leave,
      '--entertiming':transTiming.enter,
      '--leavetiming':transTiming.leave,
    }">
    <TransitionGroup v-if="!disabled" :name="name" :tag="tag" class="container" :style="{
      'perspective':perspective,
      '-webkit-perspective':perspective
    }">
      <slot></slot>
    </TransitionGroup>
    <div v-if="disabled" class="flex flex-col">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, } from 'vue';
import type { PropType } from "vue";
import type TranstionTypes from "../types/transtion";

export default defineComponent({
  name:'vmo-transition-group',
  props:{
    name:{ // 过渡效果名称
      type:String as PropType<TranstionTypes.name>,
      default:'growx'
    },
    tag:{ // 容器元素
      type:String as PropType<TranstionTypes.tag>,
      default:'ul'
    },
    itemDisplay:{ // 多列布局时，请选用 inline-block
      type:String as PropType<'block'|'inline-block'|'flex'>,
      default:'flex'
    },
    duration:{ // 过渡持续时长
      type:[Number,Object] as PropType<number|{enter:number,leave:number}>,
      default:()=>({enter:300,leave:300}),
    },
    timing:{
      type:[String,Object] as PropType<TranstionTypes.timing|{enter:TranstionTypes.timing,leave:TranstionTypes.timing}>,
      default:()=>({enter:'ease',leave:[0,0.5,1,0.5]})
    },
    disabled:{
      type:Boolean as PropType<boolean>,
      default:false,
    },
    perspective:{ // 过渡效果透视强度
      type:Number,
      default:200,
    }
  },
  setup(props,context) {
    const transDuration = computed(()=>{
      if(props.duration.constructor == Number){
        return {enter:props.duration/1000+'s',leave:props.duration/1000+'s'}
      }else{
        let duration = props.duration as {enter:number,leave:number};
        return {enter:duration.enter/1000+'s',leave:duration.leave/1000+'s'}
      }
    });
    const transTiming = computed(()=>{
      if(props.timing.constructor !== Object){
        if(props.timing.constructor === String){
          return { enter:props.timing,leave:props.timing }
        }else{
          let timingAry:number[]|string = props.timing as number[];
          timingAry = timingAry.join(',');
          return { enter:`cubic-bezier(${timingAry})`,leave:`cubic-bezier(${timingAry})` }
        }
      }else{
        let timeingObject = props.timing as {enter:TranstionTypes.timing,leave:TranstionTypes.timing};
        let result:{enter:string,leave:string} = {enter:'',leave:''};
        if(timeingObject.enter?.constructor === String){
          result.enter = timeingObject.enter;
        }else{
          let enter:number[]|string = timeingObject.enter as number[];
          result.enter = `cubic-bezier(${enter.join(',')})`;
        }
        if(timeingObject.leave?.constructor === String){
          result.leave = timeingObject.leave;
        }else{
          let leave:number[]|string = timeingObject.leave as number[];
          result.leave = `cubic-bezier(${leave.join(',')})`;
        }
        return result;
      }
    })
    return {
      transDuration,
      transTiming,
    }
  },
})
</script>

<style>
@import url('../css/fade.css');
@import url('../css/zoomin.css');
@import url('../css/scrolldown.css');
@import url('../css/falling.css');
@import url('../css/flipx.css');
@import url('../css/flipy.css');
@import url('../css/scrollup.css');
@import url('../css/scrollleft.css');
@import url('../css/scrollright.css');
@import url('../css/zoombounce.css');
@import url('../css/growy.css');
@import url('../css/growx.css'); 
.aq-transition-group{
  --itemdisplay:'inline-block';
  --perspectives:500;
  --entertiming:ease;
  --leavetiming:ease;
  --enter:0s;
  --leave:0s;
}
.aq-transition-group>.container{
  text-align: left !important;
  position:relative;
  padding: 0;
  max-width: none; /* 此处一定要加上 max-width:none 因为 container 样式 与 媒体查询的容器样式有冲突 */
  /* perspective: var(--perspective) !important;
  -webkit-perspective: var(--perspective) !important; */
  /* display:flex;
  flex-direction:row;
  flex-wrap:wrap;
  flex-grow:1;
  align-items:flex-start;
  align-content:flex-start; */
}
.aq-transition-group .container > *{
  display: var(--itemdisplay) !important;
}

/* 1. 声明过渡效果 */
/* .aq-transition-group .growy-move,
.aq-transition-group .growy-enter-active,
.aq-transition-group .growy-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
} */

/* 2. 声明进入和离开的状态 */
/* .aq-transition-group .growy-enter-from,
.aq-transition-group .growy-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(0px, 0);
} */

/* 3. 确保离开的项目被移除出了布局流
      以便正确地计算移动时的动画效果。 */
/* .aq-transition-group .growy-leave-active {
  position: absolute;
} */
</style>

