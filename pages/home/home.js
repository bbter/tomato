const {
  http
} = require('../../lib/http.js')

Page({
  data: {
    lists: [],
    visibleCreateConfirm: false,
    visibleUpdateConfirm: false,
    updateContent:"",
    updateId:'',
    updateIndex:''
  },
  onShow() {
    http.get('/todos?completed=false').then(response => {
      this.setData({
        lists: response.data.resources
      })
    })
  },
  confirmCreate(event) {
    const content = event.detail
    http.post('/todos', {
        description: content
      })
      .then(response => {
        const todo = [response.data.resource]
        const newLists = todo.concat(this.data.lists)
        this.setData({
          lists: newLists
        })
        this.hideCreateConfirm()
      })
  },
  confirmUpdate(event){
    const index = this.data.updateIndex
    const id = this.data.updateId
    const content = event.detail
    http.put(`/todos/${id}`, {
        description:content
    }).then(response => {
      const todo = response.data.resource
      this.data.lists[index] = todo
      this.setData({
        lists: this.data.lists
      }),
      this.hideUpdateConfirm()
    })
  },
  destoryTodo(event) {
    const index = event.currentTarget.dataset.index
    const id = event.currentTarget.dataset.id
    http.put(`/todos/${id}`, {
      completed: true
    }).then(response => {
      const todo = response.data.resource
      this.data.lists[index] = todo
      this.setData({
        lists: this.data.lists
      })
    })
  },
  changeText(event) {
    const {content,id,index} = event.currentTarget.dataset
    this.data.updateId = id
    this.data.updateIndex = index
    this.setData({visibleUpdateConfirm:true,updateContent:content})
  },
  hideUpdateConfirm(){
    this.setData({
      visibleUpdateConfirm:false
    })
  },
  hideCreateConfirm(event) {
    this.setData({
      visibleCreateConfirm: false
    })
  },
  showCreateConfirm() {
    this.setData({
      visibleCreateConfirm: true
    })
  }
})