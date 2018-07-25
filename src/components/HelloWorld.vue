<template>
  <div
    id="aaa"
    class="hello"
    style="width:100%;">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul @click="handleClick">
      <li>ddd</li>
    </ul>
    <div>{{ data }}</div>
  </div>
</template>

<script>
import { getCodeManageListData } from 'api/code'
export default {
  name: 'HelloWorld',
  // props: [
  //   prop1,
  //   prop2
  //   // prop2:{
  //   //   default:1
  //   // }
  // ],
  components: {
  },
  props: {

  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      data: ''
    }
  },
  computed: {
  },
  mounted () {
  },
  created () {
    this._getCodeManageListData()
  },
  methods: {
    handleClick () {

    },
    _getCodeManageListData () {
      getCodeManageListData()
        .then(res => {
          this.data = res.data
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
