module.exports = function () {

  this.main.isImage = function (cb) {
    const file = this.value;
    if (file) {

      // if (this.field === `avatar` && file.length > 1) {
      //   this.value = this.value.length;
      //   this.raise(`one file only`);
      // } else if (this.field === `photo` && file.length > 3) {
      //   this.value = this.value.length;
      //   this.raise(`three photos maximum`);
      // }

      file.map((obj) => {
        const fileExt = obj.mimetype;
        // const fileSize = obj.size;

        if (fileExt !== `image/jpeg` && fileExt !== `image/png`) {
          this.value = fileExt;
          this.raise(`should be jpeg or png image`);
        }
        // if (fileSize > 1000000) {
        //   this.value = (fileSize / 1000000).toFixed(1) + `Mb`;
        //   this.raise(`size should be less then 1Mb`);
        // }
      });
    }
    cb();
  };
};
