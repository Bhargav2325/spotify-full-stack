import { v2 as cloudinary } from "cloudinary";
import albumModel from "../models/albumModel.js";

const addAlbum = async (req, res) => {
  try {
    const name = req.body.name;
    const desc = req.body.desc;
    const bgColor = req.body.bgColor;
    const imageFile = req.file;
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    const albumData = {
      name,
      desc,
      bgColor,
      image: imageUpload.secure_url,
    };
    await albumModel.create(albumData);

    res.json({ success: true, message: "Album Added" });
  } catch (error) {
    console.log("error", error);
    res.json({ success: false, message: error?.message });
  }
};

const listAlbum = async (req, res) => {
  try {
    const allAlbums = await albumModel.find({});
    res.json({ success: true, album: allAlbums });
  } catch (error) {
    res.json({ success: false, message: error?.message });
  }
};

const removeAlbum = async (req, res) => {
  try {
    await albumModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "album deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error?.message });
  }
};

export { addAlbum, listAlbum, removeAlbum };
