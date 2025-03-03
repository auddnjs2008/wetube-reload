import User from '../models/User';
import Video from '../models/Video';
import bcrypt from 'bcrypt';

export const getJoin = (req,res) => {

    return res.render('join',{pageTitle:'Join'});
};

export const postJoin = async (req,res) => {
    
    const {name,username,email,password,password2,location} = req.body;
    if(password !== password2){
        return res.status(400).render('join',{pageTitle:'Join',errorMessage:'Password confirmation does not match.'});
    }
    const exists = await User.exists({$or:[{ username },{ email }]});
    if(exists){
        return res.status(400).render('join',{pageTitle:'Join',errorMessage:'This username/email is already taken'});
    }
    
   try{
    await User.create({
        name,
        username,
        email,
        password,
        location
    });

    return res.redirect('/login')
   }catch(error){
     return res.status(400).render('join',{pageTitle:'Upload Video',errorMessage:error._message});
   }
}

export const getEdit = (req,res) => {

    return res.render('edit-profile',{pageTitle:'Edit Profile'});
};

export const postEdit = async (req,res) => {
    const {session:{user:{_id:id,avatarUrl}},file} = req;
    
    const {name,email,username,location} =req.body;

    const updatedUser = await User.findByIdAndUpdate(id,{
        avatarUrl:file ? file.path : avatarUrl,
        name,
        email,
        username,
        location
    },{new: true});

    req.session.user = updatedUser;

    return res.redirect('/users/edit');
}




export const getLogin = (req,res) => res.render('login',{pageTitle:'Login'});

export const postLogin = async (req,res) => {
    const {username,password} = req.body;
    const pageTitle = 'Login';
    const user = await User.findOne({username,socialOnly:false});
    if(!user){
        return res.status(400).render("login",{pageTitle,errorMessage:'An account with this username does not exists'});
    }
    
    const ok = await bcrypt.compare(password,user.password);
    if(!ok){
        return res.status(400).render("login",{pageTitle,errorMessage:'Wrong password'});
    }

    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect('/');
}

export const startGithubLogin = (req,res) => {
 const baseUrl  = 'https://github.com/login/oauth/authorize';
 const config = {
    client_id:process.env.GH_CLIENT,
    allog_signup:false,
    scope:'read:user user:email',
 }

 const params = new URLSearchParams(config).toString()
 const finalUrl = `${baseUrl}?${params}`;
 return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req,res) => {
    const baseUrl = 'https://github.com/login/oauth/access_token';
    const config = {
        client_id:process.env.GH_CLIENT,
        client_secret:process.env.GH_SECRET,
        code:req.query.code,
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const data = await( await fetch(finalUrl,
        {
            method:'POST',
            headers:{
                Accept:'application/json',
            }
        }
    )).json();
    if('access_token' in data){
        //access api
        const {access_token} = data;
        const apiUrl = "https://api.github.com"
        const userData = await(await fetch(`${apiUrl}/user`,{
            headers:{
                Authorization:`token ${access_token}`,
            }
        })).json();
        
        const emailData = await (
            await fetch(`${apiUrl}/user/emails`,{
                headers:{
                    Authorization:`token ${access_token}`,
                }
            }) 
        ).json();
        const emailObj = emailData.find(email => email.primary && email.verified);
        if(!emailObj){
            //SET NOTIFICATION
            return res.redirect('/login');
        }

        let user = await User.findOne({email:emailObj.email});
        if(!user){
            user = await User.create({
                avatarUrl:userData.avatar_url,
                name:userData.name,
                username:userData.login,
                email:emailObj.email,
                password:'',
                location:userData.location,
                socialOnly:true,
            });
          
        }
            req.session.loggedIn = true;
            req.session.user = user;
            return res.redirect('/');
        
    }else{
        return res.redirect('login');
    }
}


export const logout = (req,res) => {
    req.session.destroy();
    return res.redirect('/');
};


export const getChangePassword = (req,res) => {
    if(req.session.user.socialOnly === true){
        return res.redirect('/');
    }

    return res.render('change-password',{pageTitle:'Change Password'});
}


export const postChangePassword = async (req,res) => {
    const {
        session:{user:{_id,password}},
        body:{oldPassword,newPassword,newPasswordConfirmation}} = req;
    
    const ok = await bcrypt.compare(oldPassword,password);
    if(!ok){
        return res.status(400).render('change-password',{pageTitle:'Change Password',errorMessage:'The current password is incorrect'});

    }

    if(newPassword !== newPasswordConfirmation){
        return res.status(400).render('change-password',{pageTitle:'Change Password',errorMessage:'The passowrd does not match confirmatino'});
    }

    const user = await User.findById(_id);
    user.password = newPassword;
    await user.save();
    req.session.user.password = user.password;


    return res.redirect('/users/logout');
}


export const see = async (req,res) => {

    const {id} = req.params;
    const user = await User.findById(id).populate({
        path: "videos",
        populate: {
          path: "owner",
          model: "User",
        },
      });
    if(!user){
        return res.status(404).render('404',{pageTitle:'User not found.'})
    }
  

    return res.render('profile',{pageTitle:`${user.name}`,user});


}