#!/bin/sh

# build files
read -p "Do you want to make a clean build (y/n)?" choice
case "$choice" in
    [yY][eE][sS]|[yY])
        echo "building...";
        yarn build

        # finding newer version
        echo "$(($(<version.txt)+10))" > version.txt
        DATE=`date "+%m/%d/%Y %H:%M %p"`
        value=$(<version.txt)

        # Setting date and version code in the index.html file
        echo "\n<!-- Last update on $DATE -->" >> build/index.html
        echo "<!-- Version: 2.$(($value/10)) -->" >> build/index.html
        echo "file version updated"
        ;;
    *)
        echo "skipping build..."
        ;;
esac

# removing unwanted files *.map, favicon, manifest.json

find build/static/ -type f | grep -i map | xargs rm -f
rm -f build/favicon.ico
rm -f build/asset-manifest.json
echo "removed misc files"

# remove previous version of copy directories
rm -rf cloud/public
echo "removed previous version of code"

# code backup in cloud/public folder
cp -R build cloud/public
echo "code copied to cloud/public folder"

# copy files to git folder
read -p "Copy files to git (y/n)?" choice
case "$choice" in
    [yY][eE][sS]|[yY])
        echo "files being copied to the git folder";
        rm -rf ../attkme-conference/www
        cp -R cloud/public ../attkme-conference/www
        echo "cd /Users/Gautham/playground/attkme-conference/"
        ;;
    *)
        echo "done"
        ;;
esac