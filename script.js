//selecting all buttons and files
const imageFile = document.querySelector('.image-file');
const chooseBtn = document.querySelector('.choose');
const defaultImg = document.getElementById('img');
const filterBtns = document.querySelectorAll('.filter button');
const filterName = document.querySelector('.filter-name');
const sliderInput = document.querySelector('.slider input');
const sliderValue = document.querySelector('.slider .value');
const orientationBtns = document.querySelectorAll('.orientation button')
const resetBtn = document.querySelector('.reset-all');
const saveBtn = document.querySelector('.save');







chooseBtn.addEventListener('click', () => imageFile.click());
imageFile.addEventListener('change', loadFile);
sliderInput.addEventListener('input', changeValue);
resetBtn.addEventListener('click', resetAll);
saveBtn.addEventListener('click', saveImage)

let brightness = 100, saturation = 100, inversion = 0, greyscale = 0
let rotation = 0, verticalFlip = 1, horizontalFlip = 1;


function loadFile(){
    //getting file that was selected
    let img = imageFile.files[0] 
    if(!img){return}
    defaultImg.src = URL.createObjectURL(img);

    //removing disable class when new inmage loads
    main = document.querySelector('main')
    defaultImg.addEventListener('load', () =>{
        resetBtn.click()
        main.classList.remove('disable');
    })
}


filterBtns.forEach(btn => {
    btn.addEventListener('click', () =>{
        document.querySelector('.filter .clicked').classList.remove('clicked')
        btn.classList.add('clicked');

        filterName.innerHTML = btn.innerHTML


        //changing both value of the slider and the slider range(input) to the particular filter(details specified above)
        //and also setting the max range/input of 'bright' & 'sat' = 200 then 'inv' & 'grey' = 100
        if(btn.id === 'brightness'){
            sliderValue.innerHTML = `${brightness}%`
            sliderInput.value = brightness
            sliderInput.max = '200'
        }else if(btn.id === 'saturation'){
            sliderValue.innerHTML = `${saturation}%`
            sliderInput.value = saturation
            sliderInput.max = '200'
        }else if(btn.id === 'inversion'){
            sliderValue.innerHTML = `${inversion}%`
            sliderInput.value = inversion
            sliderInput.max = '100'
        }else{
            sliderValue.innerHTML = `${greyscale}%`
            sliderInput.value = greyscale
            sliderInput.max = '100'
        }
    })
});

function updateImage(){
   defaultImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${greyscale}% )`

   defaultImg.style.transform = `rotate(${rotation}deg) scale(${horizontalFlip}, ${verticalFlip})`
}

function changeValue(){
    //changing slider value according to that of the input
    sliderValue.innerHTML = `${sliderInput.value}%`

    //updating image filters ad slider value changes
    updateImage();

    //updating the button(that has the clicked property) id's with that of the slider input
    clicked = document.querySelector('.filter .clicked')
    if(clicked.id === 'brightness'){
        brightness = sliderInput.value
    }else if(clicked.id === 'saturation'){
        saturation = sliderInput.value
    }else if(clicked.id === 'inversion'){
        inversion = sliderInput.value
    }else{
        greyscale = sliderInput.value
    }

}

//looping through orientation buttons and for a particular id, modify the rotation or flip value which has been defaulted above before apply the scale method in the updateImage function
orientationBtns.forEach(btn =>{
    btn.addEventListener('click', () =>{
        switch(btn.id){
            case 'left':
                rotation += 90;
                break
            case 'right':
                rotation -= 90;
                break
            case 'vertical':
                switch(verticalFlip){
                    case 1:
                        verticalFlip = -1;
                        break
                    case -1:
                        verticalFlip = 1
                }
            case 'horizontal':
                switch(horizontalFlip){
                    case 1:
                        horizontalFlip = -1;
                        break
                    case -1:
                        horizontalFlip = 1
                }   
            }
        updateImage()
    })
})

function resetAll(){
    //resetting all values to default
    brightness = 100, saturation = 100, inversion = 0, greyscale = 0
    rotation = 0, verticalFlip = 1, horizontalFlip = 1;
    //selecting brightness button by default
    filterBtns[0].click()

    //updating the default values into the updateImage function
    updateImage()
}

function saveImage(){
    //creating canvas where image is going to be saved from
    const canvas = document.createElement('canvas');
    //getting a drawing context on the canvas
    const drawCanvas = canvas.getContext('2d');

    canvas.width = defaultImg.naturalWidth;
    canvas.height = defaultImg.naturalHeight;

    //applying image filter on canvas
    drawCanvas.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${greyscale}% )`;
    drawCanvas.translate(canvas.width / 2, canvas.height / 2);
    drawCanvas.scale(horizontalFlip, verticalFlip)

    //rotate canvas if rotaion is not 0...
    if(rotation !== 0){
        drawCanvas.rotate(rotation * Math.PI / 180);
    }

    //setting drawing specifics for canvas using .drawImage
    drawCanvas.drawImage(defaultImg, -canvas.width / 2, -  canvas.height / 2, canvas.width, canvas.height);

    //downloading file...
    const a = document.createElement('a');
    a.download = 'image.jpg';
    //passing anchor tag href value to canva's data URL
    a.href = canvas.toDataURL();
    a.click();
}