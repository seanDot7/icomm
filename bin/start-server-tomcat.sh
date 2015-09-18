echo [Starting Server with Tomcat7]
cd ..
export MAVEN_OPTS=$MAVEN_OPTS" -Xms256m -Xmx512m -XX:PermSize=128m -XX:MaxPermSize=256m"
mvn tomcat7:run
cd bin