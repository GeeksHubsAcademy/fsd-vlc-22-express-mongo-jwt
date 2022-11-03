async function movieFindOne (id){
    const movieFound = await MovieModel.findOne({ uuid: id });
    return movieFound;
  }


module.exports = {
    movieFindOne,


}