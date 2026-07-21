const fs = require('fs');

const files = {
    'prisma/schema/authentication/user.prisma': '  generatedReports Report[]\n  downloadedExports ExportHistory[]\n',
    'prisma/schema/vendor/vendor.prisma': '  analytics VendorAnalytics?\n',
    'prisma/schema/service/service.prisma': '  analytics ServiceAnalytics?\n',
    'prisma/schema/package/package.prisma': '  analytics PackageAnalytics?\n',
    'prisma/schema/location/zone.prisma': '  analytics ZoneAnalytics?\n',
    'prisma/schema/event/event.prisma': '  analytics EventAnalytics?\n'
};

for (const [filePath, injection] of Object.entries(files)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    let lines = content.split('\n');
    let injectIndex = -1;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('}')) {
            injectIndex = i;
            break;
        }
    }
    
    if (injectIndex !== -1) {
        lines.splice(injectIndex, 0, injection);
        fs.writeFileSync(filePath, lines.join('\n'));
        console.log('Injected relations in ' + filePath);
    } else {
        console.log('Model end not found in ' + filePath);
    }
}
