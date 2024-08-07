export const trending = (req,res) => res.render("home");

export const see = (req,res) => {

    console.log(req.params);
    return res.send('Watch')
};

export const edit = (req,res) => {
    console.log(req.params);
    return res.send('Edit')
};

export const search = (req,res) => res.send('Search');

export const upload = (req,res) => res.send('upload');

export const deleteVideo = (req,res) => {
    console.log(req.params);
    return res.send('deleteVideo')
};