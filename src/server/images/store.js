const db = require(`../../database/database`);
const mongodb = require(`mongodb`);

class ImagesStore {

  async getBucket() {
    if (this._bucket) {
      return this._bucket;
    }
    const dBase = await db;
    if (!this._bucket) {
      this._bucket = new mongodb.GridFSBucket(dBase, {bucketName: `images`});
    }
    return this._bucket;
  }

  async getImage(filename) {
    const bucket = await this.getBucket();
    const results = await (bucket).find({filename}).toArray();
    const entity = results[0];

    if (!entity) {
      return void 0;
    }
    return {info: entity, stream: bucket.openDownloadStreamByName(filename)};
  }

  async saveImage(filename, mimetype, stream) {
    const bucket = await this.getBucket();
    return new Promise((success, fail) => {
      stream.pipe(bucket.openUploadStream(filename, {contentType: mimetype})).on(`error`, fail).on(`finish`, success);
    });
  }
}

module.exports = new ImagesStore();
