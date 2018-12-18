const db = require(`../../database/database`);
const mongodb = require(`mongodb`);

class ImageStore {

  async getBucket() {
    if (this._bucket) {
      return this._bucket;
    }
    const dBase = await db();
    if (!this._bucket) {
      this._bucket = new mongodb.GridFSBucket(dBase, {bucketName: `avatars`});
    }
    return this._bucket;
  }

  async saveImage(filename, mimetype, stream) {
    const bucket = await this.getBucket();
    return new Promise((success, fail) => {
      stream.pipe(bucket.openUploadStream(filename, {contentType: mimetype})).on(`error`, fail).on(`finish`, success);
    });
  }
}

module.exports = new ImageStore();
