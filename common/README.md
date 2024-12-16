1. First create common folder or the folder that you want....

2. If you are using typescript then run command as "npx tsc --init" to terminal

3. After running above command the a tsconfig will appear, In that some changes we have to do
   changes are as follows:
   a. rootdir to "/src"
   b. outdir to "/dist"
   c. declaration to true

4. Write your code arr the code that you want to publish to npm to genenrate your own npm-packages

5. Login to your npm if not that signup with unique username by running to terminal as "npm login"

6. After that name of your project should be followed by the "username" in npm

7. Afetr doing all the things above then run "npm publish" in ternminal to publish your package

8. no error should be there, after few minutes you will be able to see your's repo or package
