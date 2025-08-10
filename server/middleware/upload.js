import multer from 'multer';

const storage = multer.diskStorage({
    destination:(req,file,cd) => {
        cd(null,'uploads/')
    },
    filename : (req,file,cd) => {
        cd(null,`${Date.now()}-${file.originalname}`)
    }
})

const fileFilter = (req,file,cd) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
    if(allowedTypes.includes(file.mimetype)){
        cd(null,true)
    }else{
      cb(new Error('Only .jpeg and jpg and .png formats are allowed'),false)
    }
}
const upload = multer({storage,fileFilter})
export default upload