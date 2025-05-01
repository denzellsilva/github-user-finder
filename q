[1mdiff --git a/scripts/functions.js b/scripts/functions.js[m
[1mindex 6e0734c..e2669fb 100644[m
[1m--- a/scripts/functions.js[m
[1m+++ b/scripts/functions.js[m
[36m@@ -104,12 +104,14 @@[m [mexport function errorShow(message = 'Invalid input.') {[m
   const error = build(['span', {class: 'error'}], [message]);[m
   const primaryHeader = document.querySelector('.populated .primary-header'); // only reference the primary header in populated body[m
 [m
[31m-  // this only works on the populated body[m
[31m-  if (primaryHeader && !primaryHeader.getAttribute('class').includes('with-error')) {[m
[31m-    primaryHeader.className = `${primaryHeader.getAttribute('class')} with-error`;[m
[31m-  }[m
[31m-[m
[31m-  searchBox.appendChild(error);[m
[32m+[m[32m  setTimeout(() => {[m
[32m+[m[32m    // this only works on the populated body[m
[32m+[m[32m    if (primaryHeader && !primaryHeader.getAttribute('class').includes('with-error')) {[m
[32m+[m[32m      primaryHeader.className = `${primaryHeader.getAttribute('class')} with-error`;[m
[32m+[m[32m    }[m
[32m+[m[41m  [m
[32m+[m[32m    searchBox.appendChild(error);[m
[32m+[m[32m  }, 20)[m
 }[m
 [m
 export function errorRemove() {[m
