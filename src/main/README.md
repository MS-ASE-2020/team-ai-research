# Update in Nov.18, 2020, Double680

## 功能更新

1.当且仅当收藏夹位于根目录时，显示所有论文`All Articles`按钮，单击可进入所有论文目录。

2.在所有论文目录下，将展示全部Paper的List，用户可对选中Paper的信息进行修改、保存、取消修改和删除操作；打开`Open`按钮尚未赋予功能。

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
