# Update in Nov.20, 2020, Double680

## 功能更新

1.`Keywords`分词展示和新建删除功能。

2.为所有的`Delete`按钮增加了一个`Confirm`步。

3.修改了文件路径逻辑，现在`NewBookmark`，`FolderInformation`和`PaperInformation`部分将分别放置于"\main\Information\"下。

## Unsolved Bugs

1.`Keywords`部分暂时无法更改文本框内容。

2.在执行成功一步保存或删除操作后，所有`<input type="text" />`类型框将不可增添字符，只可删除。

# Update in Nov.19, 2020, Double680

## 功能更新

1.取消了按钮组件的标题说明，并将所有`item`并为一列；取消了`Clear`按钮，创建新收藏夹按钮的值修改为`+`。

2.修复了`All Articles`按钮相关的bug，现在单击此按钮将立刻进入所有论文目录。

3.修复了`Folder`部分，点击`Cancel`取消编辑收藏夹后信息显示错误的问题。

4.用户单击某个收藏夹按钮后，将显示收藏夹信息，现在将不再给予`Open`按钮以进入子目录，以再次单击相同按钮代替之。若单击另一收藏夹或文章按钮，将显示新的相关信息。

5.为后续`Search`功能创了一个PlaceHolder。

# Update in Nov.18, 2020, Double680

## 功能更新

1.当且仅当收藏夹位于根目录时，显示所有论文`All Articles`按钮，单击可进入所有论文目录。

2.所有论文目录下将展示全部Paper的List，用户可对选中Paper的信息进行修改、保存、取消修改和删除操作；`Open`按钮尚未赋予功能。

3.在所有论文目录下，将不再展示`Folder`信息并提供创建`New Bookmark`的接口。

4.临时增加了`Clear`按钮以清空`InfoZone`内的所有信息。

# Update in Nov.16, 2020, Double680

## 结构更新

此次更新修改了区域显示的逻辑结构：现在`BookmarksZone`组件由`Folder`和`InfoZone`两部分组成。

1.`Folder`组件除了展示当前路径并提供返回上层的按钮外，仅展示当前路径下的子收藏夹和Paper列表和新建收藏夹的按钮。

2.`InfoZone`组件可能为空，当用户在`Folder`组件中选择新建收藏夹时，将提供新建收藏夹组件供修改；若单击某个Folder或某个Paper的button，将展示相关信息，并提供修改按钮。

## 功能更新

运行进入`Library`区域，显示根目录下的Folder List和Paper List，并提供`New Bookmark`按钮，`InfoZone`为空。Paper部分尚无实例，暂未更新。

1.现在当用户单击某个子收藏夹按钮时，将不再直接进入该收藏夹，而是在`InfoZone`区域显示该收藏夹信息。

1-1.继续单击`Open`才可进入该子收藏夹，单击`Delete`将直接删除该子收藏夹。

1-2.单击`Edit`按钮可进行修改，但是现在当用户单击`Cancel`取消修改后，文本框中内容将修正为修改前的信息内容，而非用户之前未保存的修改信息。

2.单击`New Bookmark`按钮，`InfoZone`区域将切换为建立新收藏夹的信息编辑页。

2-1.输入信息后单击`Create`后，成功保存收藏夹信息，并清空`InfoZone`。

2-2.单击`Cancel`后，直接清空`InfoZone`。
