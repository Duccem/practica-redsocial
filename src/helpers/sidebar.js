const {imageStats,imageCounter} = require('./stats');
const Images = require('./images');
const Comments = require('./comments');

async function SidebarData(viewModel){
    const result = await Promise.all([
        Images.popular(),
        Comments.newest()
    ]);
    viewModel.sidebar={
        popular:result[0],
        comments:result[1]
    };
    return viewModel;
}

async function userImageCounter(viewModel,user_id){
    const result = await imageCounter(user_id);
    viewModel.sidebar.userStats = result;
    return viewModel;
}

async function imageStatsSideBar(viewModel,image_id){
    const result = await imageStats(image_id);
    viewModel.sidebar.stats = result;
    return viewModel;
}

module.exports = {
    imageStatsSideBar,
    userImageCounter,
    SidebarData
}