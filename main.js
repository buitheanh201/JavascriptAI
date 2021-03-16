let classifier,featureExtractor;
let voilume = '';
const $ = document.querySelector.bind(document);
const setUpWebCam = async() => {
     const webcamElement = $('.webcam');
     const camera = await navigator.mediaDevices.getUserMedia({ video : true});
     webcamElement.srcObject = camera;
     webcamElement.style.transform = 'scale(-1,1)';
     webcamElement.play();
     return webcamElement;
}

//set up
const setUpAI = async() => {
    const webcam = await setUpWebCam();
    featureExtractor = ml5.featureExtractor('MobileNet',modelReady);
    const options = { numLabels: 3 };
    classifier = featureExtractor.classification(webcam,options);
}

$('#train').addEventListener('click',() => {
    trainModel();
});
$('#save').addEventListener('click',() => {
    saveModel();
})
$('#start').addEventListener('click',() => {
    startAI();
})
$('#saveAll').addEventListener('click',() => {
    classifier.save()
})
const startAI = () => {
    classifier.classify((error ,result) => {
        if(error) console.log(error);
        if(result[0].label !== voilume){ 
            $('.name').innerHTML = result[0].label;
            console.log(result);
            responsiveVoice.speak(`${result[0].label}`, "Vietnamese Female");
        }
        voilume = result[0].label;
        startAI();
    })
}
const trainModel = () => {
    classifier.addImage(`${$('.username').value}`);
}

const saveModel = () => {
   classifier.train(loss => {
       if(loss === null) console.log('tranning complete !');
       console.log(loss);
   })
}

const webCamReady = () => {
    console.log('webcam is running !') 
}

const modelReady = () => {
    console.log('model is running !');
    classifier.load('./model.json',() => {
        console.log('custom model is loaded');
    })
}
window.addEventListener("DOMContentLoaded",() => {
       setUpAI();
})