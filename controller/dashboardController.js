
exports.dashboard = async (req, res) => {
    const views = req.cookies["new"] ? +req.cookies["new"] + 1 : 2;
    res.cookie('new', views, {expires:new Date("2022-10-25"), httpOnly:true })

    // console.log('cookies', res.cookie)
    
    // res.cookie('views', 2);

    res.render("dashboard")
}