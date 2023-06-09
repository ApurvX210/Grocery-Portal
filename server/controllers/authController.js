import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken"
const registerController=async(req,res)=>{
    try {
        const {name,email,password,phone,address,answer}=req.body;
        //validation
        if(!name){
            return res.send({message:'Name is Required'})
        }
        if(!email){
            return res.send({message:'Email is Required'})
        }
        if(!password){
            return res.send({message:'Password is Required'})
        }
        if(!phone){
            return res.send({message:'Phone No is Required'})
        }
        if(!address){
            return res.send({message:'Address is Required'})
        }
        if(!answer){
            return res.send({message:'Address is Required'})
        }
        //existing user
        const existinguser=await userModel.findOne({email})
        if(existinguser){
            return res.status(200).send({
                success:false,
                message:"Already Register Please Login",
            })
        }
        //register user
        const hp=await hashPassword(password);
        console.log(hashPassword);
        // save
        const user=await new userModel({name,email,phone,address,password:hp,answer}).save();
        res.status(201).send({
            success:true,
            message:"User Register Successfully",
            user
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in Registration",
            error
        })
    }
};
const loginController=async (req,res)=>{
    try {
        const {email,password}=req.body;
        //validation
        if(!email || !password){
            return res.status(404).send({
                success:false,
                message:"Invalid email or password",
            })
        }
        const user=await userModel.findOne({email});
        if(!user){
            return res.status(404).send({
                success:false,
                message:"Email is not Registered",
            })
        }
        const match=await comparePassword(password,user.password);
        if(!match){
            return res.status(200).send({
                success:false,
                message:"Invalid Password",
            })
        }
        //Token
        const token=await JWT.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"1h"});
        res.status(200).send({
            success:true,
            message:"Login Successfully",
            user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role:user.role
            },
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in Login",
            error
        })
    }
}

//forget Password

const forgetPasswordController= async (req,res)=>{
    try {
        const{email,answer,newPassword}=req.body;
        if(!email){
            res.status(500).send({
                message:"Email is Required",
            })
        }
        if(!answer){
            res.status(500).send({
                message:"Answer is Required",
            })
        }
        if(!newPassword){
            res.status(500).send({
                message:"New Password is Required",
            })
        }
        //check
        const user= await userModel.findOne({email,answer});
        //validation
        if(!user){
            return res.status(404).send({
                success:false,
                message:'Wrong email or answer'
            })
        }
        const hash=await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id,{password:hash})
        res.status(200).send({
            success:true,
            message:"Password Reset Succesfully"
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Something Went Wrong',
            error
        })
    }
}
//test Controller
const testController=(req,res)=>{
    res.send("Hello There")
}
//update profile controller
const updateProfileController =async(req,res)=>{
    try {
        const{name,email,address,phone}=req.body;
        const user =await userModel.findById(req.user._id);
        const updateUser =await userModel.findByIdAndUpdate(req.user._id,{
            name:name || user.name,
            phone:phone || user.phone,
            address:address || user.address
        },{new:true})
        res.status(200).send({
            success:true,
            message:"Profile Updated Successfully",
            updateUser
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error while updating profile',
            error
        })
    }
}
//orders
const getOrdersController =async(req,res)=>{
    console.log("hello")
    try {
        const orders= await orderModel.find({buyer:req.user._id}).populate('products','-image').populate("buyer","name");
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error while Retrieving Orders',
            error
        })
    }
}
//all orders
const getAllOrdersController =async(req,res)=>{
    console.log("hello")
    try {
        const orders= await orderModel.find({}).populate('products','-image').populate("buyer","name").sort({createdAt:"-1"});
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error while Retrieving Orders',
            error
        })
    }
}
const orderStatusController = async(req,res)=>{
    try {
        const{orderId}=req.params
        const{status}=req.body
        console.log("Hello"+orderId)
        console.log("Buy"+status)
        const orders=await orderModel.findByIdAndUpdate(orderId,{status},{new:true});
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error while Updating Status',
            error
        })
    }
}
export {registerController,loginController,testController,forgetPasswordController,updateProfileController,getOrdersController,getAllOrdersController,orderStatusController};