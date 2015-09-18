echo [INFO] Use maven eclipse-plugin download jars and generate eclipse project files.

cd ..
tempvar=`pwd`
mvn -Declipse.workspace=$tempvar eclipse:clean eclipse:eclipse
cd bin
