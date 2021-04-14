import VueI18n from "vue-i18n";
import Vue from "vue";
Vue.use(VueI18n);

import zh from './config/zh';
import en from './config/en';

const i18n = new VueI18n({
    locale : localStorage.getItem('local') || 'zh',
    messages:{
        zh,en
    }
})

export default i18n;