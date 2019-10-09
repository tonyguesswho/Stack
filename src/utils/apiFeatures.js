class APIFeatures {
  constructor(query, reqQuery) {
    this.query = query;
    this.reqQuery = reqQuery;
  }

  filter() {
    const queryObj = { ...this.reqQuery };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj); //filtering
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`); //filtering
    this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.reqQuery.sort) {
      const sortBy = this.reqQuery.sort.split(',').join(' '); //sorting
      this.query = this.query.sort(sortBy); //sorted
    } else {
      this.query = this.query.sort('-createdAt'); //default sorting
    }
    return this;
  }

  fields() {
    if (this.reqQuery.fields) {
      const requiredFields = this.reqQuery.fields.split(',').join(' '); //limiting
      this.query = this.query.select(requiredFields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.reqQuery.page * 1 || 1;
    const limit = this.reqQuery.limit * 1 || 100;
    const skip = limit * (page - 1);
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export default APIFeatures;
