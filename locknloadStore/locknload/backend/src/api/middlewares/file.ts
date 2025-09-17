import multer from 'multer';

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/'); // Pasta onde os arquivos serão armazenados
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname); // Nome do arquivo
  },
});

const upload = multer({ storage: multer.memoryStorage() });

export default upload;
