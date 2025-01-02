import {Jimp} from 'jimp'
import test1 from './assets/test-button.jpg';
import test2 from './assets/test-2.jpeg';
import {createCanvas} from 'canvas';
import {getDocument, GlobalWorkerOptions} from "pdfjs-dist";

GlobalWorkerOptions.workerSrc=new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

export async function PDFtoIMG(PDFfile: string){
    const dataList = [];
    const pdfDocumentLoadingTask = getDocument(PDFfile);
    //const canvas = createCanvas();
    const pdfDocument = await pdfDocumentLoadingTask.promise;
    for (let i = 0; i < pdfDocument.numPages; i++) {
        const page = await pdfDocument.getPage(i + 1);
        const pageViewport = page.getViewport({scale: 1});
        const canvas = createCanvas(pageViewport.width, pageViewport.height);
        console.log(pageViewport.height, pageViewport.height)
        const ctx = canvas.getContext("2d");
        const pageRenderTask = page.render({canvasContext: ctx, viewport: pageViewport});
        await pageRenderTask.promise;
        console.log(canvas.toDataURL('image/png'));
        dataList.push(canvas.toDataURL('image/png'));
    }
    return dataList;
}

async function ImageConverter(/*imageList: Buffer[]*/){
    /*for (const image of imageList){
        sharp(image)
    }*/
    const img1 = await Jimp.read(await fetch(test1).then(res => res.arrayBuffer()));
    const img2 = await Jimp.read(await fetch(test2).then(res => res.arrayBuffer()));
    const background = new Jimp({ width: 1200, height: 1200, color:0xffffffff});
    background.composite(img1, 0, 0);
    background.composite(img2, 100, 150);
    return await background.getBuffer("image/png");
}
export default ImageConverter;