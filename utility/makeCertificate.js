// Define font files
var fonts = {
    Roboto: {
        normal: 'fonts/Roboto-Regular.ttf',
        bold: 'fonts/Roboto-Medium.ttf',
        italics: 'fonts/Roboto-Italic.ttf',
        bolditalics: 'fonts/Roboto-MediumItalic.ttf'
    }
};

var PdfPrinter = require('pdfmake');
var printer = new PdfPrinter(fonts);
var fs = require('fs');


function makeCertificate(eventName,categoryName,teamName,clubName,filename,ownerName,teamMembers,uniqueId)
{
    var members = [{text:ownerName,margin:[150,10],bold:true,fontSize:18}];
    for(var i=0;i<teamMembers.length;++i)
    {
        members.push(
            {
                text:teamMembers[i],
                margin:[150,2],
                fontSize:18,
                bold:true 
            } 
        );
    }
    var docDefinition = {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        pageMargins: [0, 0, 0, 0],
        watermark: { text: 'LPU Colors', opacity: 0.1, angle: 0 },
        content: [
            {
                table: {
                    body: [[{
                        stack: [
                            //you content goes here
                            {
                                image: 'utility/header.png',
                                width: 300,
                                margin: [264, 50]
                            } 
                            ,
                            {
                                text: 'Certificate Of Recognition',
                                style: 'header',
                                fontSize: 28,
                                bold: true,
                                margin: [250, 10]
                            },
                            {
                                text: 'This is to certify that team ' + teamName +' has participated in '+ eventName + '(' + categoryName +')' + ' organised by ' + clubName + '. Greetings from the Divison of Student Welfare for your participation. ',
                                style: 'header',
                                fontSize: 16,
                                margin: [50, 10]
                            },
                            members,
                            {
                                qr: 'Team Name: ' + teamName + ' EventName: ' + eventName + ' CategoryName: ' + categoryName,
                                fit: '100',
                                foreground: 'red',
                                margin:[700,5,0,0]
                            }
                            ,
                            {
                                text:'Certificate No: ' + uniqueId,
                                margin:[600,10,0,0],
                                bold:true
                            }

                        ]
                    }]]
                },
                layout: {
                    //set custom borders size and color
                    hLineWidth: function (i, node) {
                        return (i === 0 || i === node.table.body.length) ? 3 : 1;
                    },
                    vLineWidth: function (i, node) {
                        return (i === 0 || i === node.table.widths.length) ? 3 : 1;
                    },
                    hLineColor: function (i, node) {
                        return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
                    },
                    vLineColor: function (i, node) {
                        return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
                    }
                }
            }
        ]
    };
    var pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(fs.createWriteStream('event-certificates/' + filename ));
    pdfDoc.end();
}


//makeCertificate('Youth Vibe 2019','Nukkad Natak','Trail Blazers','SCSE','sample.pdf','Ankit',['Neha','Rashmi','Soundarya','Nagasuri Venkata Seshaiah'],'56413');

module.exports = makeCertificate;