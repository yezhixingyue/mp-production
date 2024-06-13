## 对返回数据的格式进行重新规定

```ts
  // 原返回内容：
  Promise<IResponseType<IMpzjResponse<T>> | null>

  // 修改为：不再丢弃一些错误信息而返回null - 因为后续可能有需要用到的地方 ---- 添加字段控制：根据字段控制返回内容
```
