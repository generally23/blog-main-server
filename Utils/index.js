const jwt = require("jsonwebtoken");
const multer = require("multer");

const objectAssign = (source, target) => {
  if (!source || !target) {
    // error
    return;
  }
  for (let key in source) {
    if (source[key]) target[key] = source[key];
  }
};

const isSame = (v1, v2) => {};

const generateJwt = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY || "secret", {
    expiresIn: process.env.JWT_EXPIRATION_TIME || 3600 * 24 * 30 + "s",
  });
};

const uploader = () => {
  const storage = multer.memoryStorage();

  return multer({
    storage,
    fileFilter(req, file, cb) {
      const r = /.+\/(jpg|jpeg|png|webp|gif)$/;

      if (!file.mimetype.match(r)) {
        // error
        cb(new Error("wrong file extension"));
      }

      cb(null, true);
    },
    limits: {
      fileSize: process.env.MAX_AVATAR_SIZE || 5000000,
      files: 1,
    },
  });
};

const sanitizeToStr = (value) => {
  if (!value) return;
  if (value.constructor === Array) return value[0];
  if (value.constructor === Object) return;
  return value;
};

// delete properties from a source object
const deleteProps = (src, ...props) => {
  props.forEach((prop) => delete src[prop]);
};

const paginateModel = async (
  Model,
  filterObj = {},
  sortStr = "",
  pagingInfo = { page: 1, limit: 10 }
) => {
  // find documents length
  const docsCount = await Model.countDocuments(filterObj);

  // get paging info
  let page = parseInt(pagingInfo.page);
  let limit = parseInt(pagingInfo.limit);

  // sanitize user input
  if (isNaN(page)) page = 1;

  if (isNaN(limit)) limit = 10;

  if (limit < 0) limit = 10;

  if (page < 0) page = 1;

  let firstPage = 1;
  let pages = Math.ceil(docsCount / limit);
  let lastPage = pages;

  if (isNaN(pages)) {
    pages = firtsPage = lastPage = page = limit = 0;
  }

  if (page > pages) page = pages;

  const prevPage = firstPage < page ? page - 1 : null;
  const nextPage = lastPage > page ? page + 1 : null;

  const read = page - firstPage;
  const toread = lastPage - page;

  const skip = (page - 1) * limit;

  const docs = await Model.find(filterObj)
    .sort(sortStr)
    .skip(skip)
    .limit(limit)
    .populate("author");

  const docsLength = docs.length;

  return {
    page,
    pages,
    nextPage,
    prevPage,
    read,
    toread,
    docs,
    totalResults: docsCount,
    docsLength,
  };
};

module.exports = {
  generateJwt,
  isSame,
  objectAssign,
  uploader,
  deleteProps,
  sanitizeToStr,
  paginateModel,
};
