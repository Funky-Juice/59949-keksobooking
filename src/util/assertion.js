module.exports = function () {

  this.main.isImage = function (cb) {
    if (this.value) {

      this.value.map((obj) => {
        const fileExt = obj.mimetype;
        const fileSize = obj.size;

        if (fileExt !== `image/jpeg` && fileExt !== `image/png`) {
          this.value = fileExt;
          this.raise(`should be jpeg or png image`);
        }
        if (fileSize > 1000000) {
          this.value = (fileSize / 1000000).toFixed(1) + `Mb`;
          this.raise(`size should be less then 1Mb`);
        }
      });
    }
    cb();
  };
};
