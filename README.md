# koa-param-validate

a validator for koa

## Install

```bash
$ npm install koa-param-validate --save
```

## Usage

### Example

```js
// app.js
const Koa = require("koa")
const koaParamValidate = require("koa-param-validate")

const app = new Koa()

koaParamValidate(app.context, app)

app.listen(3000, () => {
  console.log("server is running...")
})
```

```js
// controller/auth.js
module.exports = (app) => ({
  async login() {
    const { ctx } = app

    try {
      ctx.validate({
        username: "string",
        password: "string",
      });
    } catch (error) {
      console.log(error);
    }

    ctx.body = {
      code: 200,
      msg: "success",
    }
  }
})
```

## Api

- ### validate

```js
ctx.validate({
  username: "string",
  age: "number",
})
```

- ### addRule

```js
// add password rule
app.validator.addRule("password", (rule, value) => {
  if (value.toString().length < 6) {
    return "the length cannot be less than 6 characters"
  }
})
```
