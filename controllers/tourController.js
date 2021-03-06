const fs = require('fs');
const Tour = require('../models/tourModel')
const multer = require("multer");
const sharp = require("sharp")


// exports.checkBodyMiddleware = (req, res, next) => {
//     console.log(req.body)
//     if(!req.body.name && !req.body.price){
//         return res.status(400).json({status: 'fail', message: 'Bad request'});
//     }
//     next();
// }

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')){
        cb(null, true);
    }else{
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadTourImages = upload.fields([
    {name: 'imageCover', maxCount: 1},
    {name: 'images', maxCount: 3}
])

exports.resizeTourImages = (req, res, next) => {
    console.log(req.files)
    next();
}



exports.getAllTours = async (req, res) => {
    try {
        // BUILD A QUERY
        // 1A) Filtering
        const queryObj = {...req.query};
        const excludedFields = ['page', 'sort', 'limit', 'fields']
        excludedFields.forEach(el => delete queryObj[el]);

        // 1B) Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match =>`$${match}`);
        let query = Tour.find(JSON.parse(queryStr));
        // 2) Sorting
        if(req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
           query = query.sort(sortBy);
           // sort('price ratingsAverage')
        }else{
            query = query.sort('-createdAt');
        }

        // 3) Field limiting
        if(req.query.fields){
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        }else{
            query = query.select('-__v');
        }



        // 4) Pagination
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);

        if (req.query.page) {
            const numTours = await Tour.countDocuments();
            if(skip >= numTours) throw new Error('This page does not exist')
        }


        // EXECUTE A QUERY
        const tours = await query;
        // const query = Tour.find()
        //     .where('duration').equals(5)
        //     .where('difficulty').equals('easy');

        // SEND RESPONSE
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            error: err.message
        })
    }

};
exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        // Tour.findOne({_id: req.params.id})
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            error: err
        })
    }
    //const id = +req.params.id;
    // const tour = tours.find(el => el.id === +req.params.id);
    // res.status(200).json({
    //     status: 'success',
    //     data: {
    //         tour
    //     }
    // });
};
exports.createTour = async (req, res) => {
    try {
        // const newTour = new Tour({})
        // newTour.save()
        const newTour = await Tour.create(req.body)

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err
        })
    }

    // const newId = tours[tours.length - 1].id + 1;
    // const newTour = Object.assign({id: newId}, req.body);
    // tours.push(newTour);
    // fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,
    //     JSON.stringify(tours), err => {
    //         res.status(201).json({
    //             status: 'success',
    //             data: {
    //                 tour: newTour
    //             }
    //         });
    //     });
};
exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body,
            {
                new: true,
                runValidators: true
            });
        res.status(200).json({
            status: 'success',
            data: {
                // tour: tour
                // ||
                tour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            error: err
        })
    }
};
exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            error: err
        });
    }
};


