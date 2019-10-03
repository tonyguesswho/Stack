exports.getAllQuestions = async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      results: 'tours.length',
      data: {
        questions: 'questions'
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error
    });
  }
};
