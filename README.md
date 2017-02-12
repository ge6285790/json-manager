Json-Manager — JSON 視覺化管理介面
================================
**====================**

**目前專案尚在測試開發階段**

**====================**

<br/>
<br/>
使用線上 JSON 管理介面：https://json-manager.herokuapp.com/assets/index.html
操作教學影片：https://drive.google.com/open?id=0BzYH8rbYZaYQMThTR084Z3lOSms

##一. 簡介

JSON 視覺化管理介面，透過操作介面可完成：

1. 匯入 JSON 資料（透過 file or API）

2. 新增子項目

3. 刪除子項目

4. 轉換資料型別（ex. Object to String）

5. 修改後的 JSON file 下載或是進行 CRUD API 操作



##二. 安裝

	1. git clone
	2. npm install
	3. npm run dev
	4. open http://localhost:8000/assets/index.html

##三. 用法

將 json-manager 導入專案內，給其原始設定資訊後將其實體化，便會產生 React Template 塞入 Dom 結構中。

##四. 範例

```jsx
/* import json-manager to project */
import Jmgr from './json-manager';

/* set init option */

const option = {

  defaultData: {}, // if want to show default json data on the page, you can write in defaultData
  crud: {
    create: {
      url: '', //  api url
      type: 'POST', // api type can choice GET/POST
    },

    read: {
      url: '', // we will use this url to fetchData JSON from server
      type: 'GET', // api type can choice GET/POST
      data: {}, // read api send data
      refernceFlag: '', // choice the key-pair you want to import, ex data>status
    },

    update: {
      url: '',
      type: 'POST', // api type can choice GET/POST
      data: {},
    },

    delete: {
      url: '',
      type: 'DELETE', // api type can choice GET/POST/DELETE
      data: {},
    },
  },
  elementId: 'root' // tag id, React will insert to this element
};

/* new constructor */
const json = new Jmgr(option);


```

##五. API

如果需要透過其他介面來進行操作，則可參考下方提供API：

ex. const json = new Jmgr(option);

API 名稱                       |  解釋
------------------------------ | -------------
json.mode.importMode(visable) | 彈出 import JSON 視窗。參數『visible』可填入：'true'/'false'/或者不填，不填參數則自行做trigger切換
json.mode.editMode()   | 切換 JSON 管理狀態為【編輯模式】。（編輯 JSON DATA）
json.mode.sendMode()   | 切換 JSON 管理狀態為【傳送模式】。（JSON DATA API CRUD）
json.crud.updateUrl(option) | 修改 api url 位址，ex. option: {type: 'create'/'read'/'update'/'delete'(任一), url: 'http://google.com'}
json.crud.updateData(option) | 修改 read api ajax data，ex. option: {type: 'read', value: {pid: '111'}}
json.crud.updateType(option) | 修改 api type 位址，ex. option: {type: 'create'/'read'/'update'/'delete'（任一）, crudType: 'GET/POST/DELETE'（任一）}
json.crud.resetAllOption(option) | 修改預設option，格式請參考【四. 範例】內的option寫法
json.crud.create() | 將已選取的 data 使用 create 傳送至 server
json.crud.read() | 將已選取的 data 使用 read 傳送至 server
json.crud.update() | 將已選取的 data 使用 update 傳送至 server
json.crud.delete() | 將已選取的 data 使用 delete 傳送至 server
json.exportJSON() | 將當前編輯好的 JSON DATA 以 .json 檔案下載
json.send.flagSelect(string) | 選擇欲傳送的資料，string 為指定到的 key，ex. {month: [value]}, string = '>month>0' => 傳送 value 上去，{month: value}, string = '>month>value' => 傳送 value 上去
json.edit.flagSelect(string) | 選擇欲修改的資料，string 為指定到的 key，ex. {month: [value]}, string = '>month>0' => 傳送 value 上去，{month: value}, string = '>month>value' => 傳送 value 上去
json.edit.typeChange(string) | 將當前選取的資料，做資料型別轉換，string = 'String'/'Array'/'Object'
json.edit.create(string) | 於當前選取的資料，將入新的子項目（value），string = 'String'/'Array'/'Object'
json.edit.create(string) | 於當前選取的資料，將入新的子項目（value），string = 'String'/'Array'/'Object'
json.edit.updateKeyName(string) | 更新 Object 的 key 名稱（此 Api 尚在建置中）
json.edit.remove(array, anchor) | 移除 key/index from Object/Array，array 為指向路徑，anchor 為欲移除項目的key（Object）或是index（Array），ex. 【Array】： {month: ['a', 'b']}, array = ['month'], anchor = 0 => 'a'被移除，【Object】： {month: {aKey: 'a', bKey: 'b'}, array = ['month'], anchor = aKey => 'aKey'被移除
json.edit.recover(array, anchor) | 回覆被移除的 key/index from Object/Array，array 為指向路徑，anchor 為欲移除項目的key（Object）或是index（Array），ex. 【Array】： {month: ['a', 'b']}, array = ['month'], anchor = 0 => 'a'被復原，【Object】：  {month: {aKey: 'a', bKey: 'b'}, array = ['month'], anchor = aKey => 'aKey'被復原



##License

MIT
