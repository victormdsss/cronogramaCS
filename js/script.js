

console.log("v.1.0")

var diaDeInicio = 22;
var mesDeInicio = 1;


var storiesContainer = document.querySelector('.artes');

var htmlStatusUsers = "";
var htmlFeed = "";
var htmlStories= "";


var diaDaSemana =["dom","seg", "ter", "qua", "qui", "sex", "sab"];
var diaDaSemanaFeed =["Domingo","Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];
var mesDoAno =["Jan","Fev", "Mar", "Abr", "Maio", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];


class Populator{

    containerOfStories = document.querySelector('.status');
    mockupOfStories = document.querySelector('#modeloffeedcard');
    containerOfFeed = document.querySelector('.feed');
    mockupOfFeed = document.querySelector('#modelofstatuscard');
    
    constructor(_startingDay, currentMonth){
        this.startingDay = _startingDay;
        this.currentMonth = currentMonth;
    }


    populateWithStoriesElements(){
        let cloneOfStorie;
        let containerOfStorie;
        diaDaSemana.forEach((element, index)=>{
            cloneOfStorie = document.querySelector('#modelofstatuscard').cloneNode(true)
            containerOfStorie = document.querySelector('#modelofstatuscard').parentNode;
            const storiesCard = new StoriesCard(cloneOfStorie)
            storiesCard.setDate(this.getCurrentDate(index))
            storiesCard.setDataInEstructure()
            containerOfStorie.appendChild(storiesCard.estructure)
        })
        containerOfStorie.removeChild(document.querySelector('#modelofstatuscard'))
    }

    getCurrentDate(_indexOfweekDaysArray){
        const date1 = new Date()
        const currentDay = this.startingDay +_indexOfweekDaysArray
        return new Date(date1.getFullYear(), this.currentMonth-1, currentDay)
    }

    populateWithFeedElements(){
        let cloneOfFeed;
        let containerOfFeed;
        diaDaSemana.forEach((element, index)=>{
            cloneOfFeed = document.querySelector('#modeloffeedcard').cloneNode(true)
            containerOfFeed = document.querySelector('#modeloffeedcard').parentNode;
            const feedCard = new FeedCard(cloneOfFeed)
            feedCard.setDate(this.getCurrentDate(index))
            feedCard.setDataInEstructure()
            containerOfFeed.appendChild(feedCard.estructure)
        })
        containerOfFeed.removeChild(document.querySelector('#modeloffeedcard'))
    }

}

class StoriesCard{
    img;
    date;
    estructure;
    constructor(_element){
        this.estructure = _element;
    }
    setDate(_date){
        this.date = _date
        this.currentDay = _date.getDate();
        this.currentWeekDay = diaDaSemana[_date.getDay()]
        this.currentMonth = mesDoAno[_date.getMonth()]
        this.spaceStories = new SpaceStories(this.currentWeekDay);
    }
    setDataInEstructure(){
        this.formatData()
        this.estructure.setAttribute('id','stories-'+this.currentWeekDay)
        this.estructure.querySelector('h4').innerHTML = this.currentDay+'/'+this.currentMonth
        this.estructure.querySelector('img').src='img/status-'+this.currentWeekDay+'.png'
        this.estructure.addEventListener('click',()=>{
            this.openStoriesSpace()
        })
    }
    formatData(){
        this.currentDay = this.currentDay < 10 ? '0'+this.currentDay : this.currentDay
    }
    openStoriesSpace(){
        toggleUsed(this.currentWeekDay)
        this.spaceStories.initialize()
    }
}

class SpaceStories{
    imageSrc;
    nomeImageSrc;
    currentImageIndex;
    prevImageButton;
    nextImageButton;
    exitButton

    constructor(weekDay){
        this.imageSrc = 'img/'+weekDay+'-folder/stories/'+weekDay+' (nImage).png'
        this.nomeImageSrc = 'img/status-'+weekDay+'-in.png'
        this.prevImageButton = document.querySelector('.prev');
        this.nextImageButton = document.querySelector('.next');
        this.exitButton = document.querySelector('.js-close-storiesContainer')
    }

    initialize(){
        this.showSpaceStoriesView()
        this.currentImageIndex = 1;
        this.verifyImage(this.currentImageIndex)
        this.controler()
    }

    showSpaceStoriesView(){
        document.querySelector(".storiesContainer").classList.add("storiesContaineractived");
    }

    verifyImage(indexOfImage, btnPressed){
        const currentSrcFile = this.imageSrc.replace('nImage', indexOfImage)
        var img = new Image();
        img.src = currentSrcFile;
        console.log(this.currentImageIndex)
        img.addEventListener('load', ()=>{
            this.setImages(img);               
        })

        img.addEventListener('error',()=>{
            console.log('error '+this.currentImageIndex)
            let noImage = new Image()
            noImage.src = this.nomeImageSrc
            this.setImages(noImage)

            if(btnPressed == 'next'){
                --this.currentImageIndex
            } else if(btnPressed == 'prev'){
                ++this.currentImageIndex 
            }
        })
    }

    controler(){
        this.adjustView(-2, 'prev')
        this.exitButton.addEventListener('click',()=>{
            this.close()
        })
        this.prevImageButton.addEventListener('click',(e)=>{
            this.prev()
        })
        this.nextImageButton.addEventListener('click',(e)=>{
            this.next()
        })
    }

    prev() {
        if(!(this.currentImageIndex-1<0)){
            this.currentImageIndex--
            this.verifyImage(this.currentImageIndex, 'prev')
        }
        this.adjustView(this.currentImageIndex-1, 'prev')
    }
    
    next() {
        this.currentImageIndex++
        this.verifyImage(this.currentImageIndex, 'next')
        this.adjustView(this.currentImageIndex+1, 'next')
    }

    adjustView(nextImageIndex, btnPressed){
        this.verifyNextImg(nextImageIndex, btnPressed)
        if(btnPressed == 'next'){
            this.prevImageButton.style.opacity = 1
        } else{
            this.nextImageButton.style.opacity = 1
        }
        
    }
    
    verifyNextImg(nextImageIndex, btnPressed){
        const currentSrcFile = this.imageSrc.replace('nImage', nextImageIndex)
        var img = new Image();
        img.src = currentSrcFile;
        img.addEventListener('load', ()=>{
            return true             
        })

        img.addEventListener('error',(e)=>{
            if(btnPressed == 'next'){
                this.nextImageButton.style.opacity = 0
                
            } else if(btnPressed == 'prev'){
                this.prevImageButton.style.opacity = 0
            }
        })
    }
    
    setImages(image){
        const testClone = image.cloneNode(true)
        document.querySelector(".storiesContainer").querySelector('.artes').querySelector('img').src=testClone.getAttribute('src')
    }

    close(){
        document.querySelector(".storiesContainer").classList.remove("storiesContaineractived");
    }

}

class FeedCard{
    img;
    date;
    estructure;
    feedControler;
    constructor(_element){
        this.estructure = _element;
        
    }
    setDate(date){
        this.date = date
        this.id = 'feed-'+diaDaSemana[this.date.getDay()]
        this.week = diaDaSemana[this.date.getDay()]
        this.currentDay = this.date.getDate();
        this.currentWeekDay = diaDaSemanaFeed[this.date.getDay()]
        this.currentMonth = mesDoAno[this.date.getMonth()]
        this.spaceStories = new SpaceStories(this.currentWeekDay);
        this.estructure.querySelector('.prev').setAttribute('id', 'prev-feed'+ this.week)
        this.estructure.querySelector('.next').setAttribute('id', 'next-feed'+ this.week)
        this.feedControler = new feedControler(diaDaSemana[this.date.getDay()], this.estructure)
    }
    setDataInEstructure(){
        this.formatData()
        this.estructure.setAttribute('id',this.id)
        this.estructure.querySelector('h3').innerHTML = this.currentWeekDay+'<br> <span>'+this.currentDay+'/'+this.currentMonth+'</span>'
        this.estructure.querySelector('.prev').setAttribute('id', 'prev-feed'+ this.week)
        this.estructure.querySelector('.next').setAttribute('id', 'next-feed'+ this.week)

        this.setFeedImages()
    }

    formatData(){
        this.currentDay = this.currentDay < 10 ? '0'+this.currentDay : this.currentDay
    }
    setFeedImages(){
        this.feedControler.initialize()
    }
}

class feedControler{

    imageSrc;
    nomeImageSrc;
    currentImageIndex;
    prevImageButton;
    nextImageButton;
    id;
    
    constructor(weekDay,ele){
        console.log("========= feed de "+weekDay+" =========")
        this.id = '#feed-'+weekDay
        this.element = ele;
        this.imageSrc = 'img/'+weekDay+'-folder/feed/'+weekDay+' (nImage).png'
        this.nomeImageSrc = 'img/nao-agendado.png'
        this.prevImageButton = ele.querySelector('#prev-feed'+weekDay);
        this.nextImageButton = ele.querySelector('#next-feed'+weekDay);
    }

    initialize(){
        console.log('iniciado feed de '+this.id)
        this.currentImageIndex = 1;
        this.verifyImage(this.currentImageIndex)
        this.controler()
    }

    verifyImage(indexOfImage, btnPressed){
        console.log('verificando imagem '+this.currentImageIndex)
        const currentSrcFile = this.imageSrc.replace('nImage', indexOfImage)
        var img = new Image();
        img.src = currentSrcFile;
        img.addEventListener('load', ()=>{
            this.setImages(img);
        })

        img.addEventListener('error',()=>{
            console.log('error '+this.currentImageIndex)
            let noImage = new Image()
            noImage.src = this.nomeImageSrc
            this.setImages(noImage)

            if(btnPressed == 'next'){
                --this.currentImageIndex
            } else if(btnPressed == 'prev'){
                ++this.currentImageIndex 
            }
        })
    }

    controler(){
        this.adjustView(-2, 'prev')
        this.prevImageButton.addEventListener('click',(e)=>{
            this.prev()
            console.log('prev')
        })
        this.nextImageButton.addEventListener('click',(e)=>{
            this.next()
            console.log('next')
        })
    }

    prev() {
        if(!(this.currentImageIndex-1<0)){
            this.currentImageIndex--
            this.verifyImage(this.currentImageIndex, 'prev')
        }
        console.log(this.currentImageIndex)
        this.adjustView(this.currentImageIndex-1, 'prev')
    }
    
    next() {
        this.currentImageIndex++
        console.log(this.currentImageIndex)
        this.verifyImage(this.currentImageIndex, 'next')
        this.adjustView(this.currentImageIndex+1, 'next')
    }

    adjustView(nextImageIndex, btnPressed){
        this.verifyNextImg(nextImageIndex, btnPressed)
        if(btnPressed == 'next'){
            this.prevImageButton.style.opacity = 1
        } else{
            this.nextImageButton.style.opacity = 1
        }
        
    }
    
    verifyNextImg(nextImageIndex, btnPressed){
        const currentSrcFile = this.imageSrc.replace('nImage', nextImageIndex)
        var img = new Image();
        img.src = currentSrcFile;
        img.addEventListener('load', ()=>{
            return true
        })

        img.addEventListener('error',(e)=>{
            if(btnPressed == 'next'){
                this.nextImageButton.style.opacity = 0

            } else if(btnPressed == 'prev'){
                this.prevImageButton.style.opacity = 0
            }
        })
    }
    
    setImages(image){
        console.log('Mostrando imagem '+image)
        const testClone = image.cloneNode(true)
        document.querySelector(this.id).querySelector('.imgBx').querySelector('img').src=testClone.getAttribute('src')
    }

}

let currentPage = 0;

							


            

const populatePage = new Populator(diaDeInicio,mesDeInicio);
populatePage.populateWithStoriesElements();
populatePage.populateWithFeedElements();





function toggleUsed(_currentStorie){
    console.log(_currentStorie)
    document.querySelector("#stories-"+_currentStorie).children[0].classList.add("used");
    document.querySelector("#feed-"+_currentStorie).querySelector(".profile_img").classList.add("used");
}











   