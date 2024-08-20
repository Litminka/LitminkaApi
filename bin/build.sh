#!/usr/bin/env bash

set -o nounset
set -o pipefail

# Pre initialization
RUNNING_DIR=$(dirname "$(realpath "${BASH_SOURCE[0]}")")
ROOT_DIR=$(dirname "$RUNNING_DIR")
VER='0.1'
SHORT_ARGS='bdhv'
LONG_ARGS='bump,debug,help,version'

# Switch initialization
BUMP=0
DEBUG=0

# Imports
source "$RUNNING_DIR/lib/baselib.sh"

read -r -d '' usage <<EOM
Usage: $(basename "$0") [options] [images]
Description:
    Pulls images from registry and update containers.
    Images must be in format <imageRegistry/imageName:tag>.
    Script accepts multiple images at the same time.

Options:
    -b,     --bump                  Bump project version
    -d,     --debug                 Debug mode
    -h,     --help                  Show help message
    -v,     --version               Show script version
EOM

parseSemVer(){
    local VERSION=$1

    VERSION_MAJOR="${VERSION%%.*}"
    VERSION_MINOR_PATCH="${VERSION#*.}"
    VERSION_MINOR="${VERSION_MINOR_PATCH%%.*}"
    VERSION_PATCH_PRE_RELEASE="${VERSION_MINOR_PATCH#*.}"
    VERSION_PATCH="${VERSION_PATCH_PRE_RELEASE%%[-+]*}"
    VERSION_PRE_RELEASE=""

    case "$VERSION" in
      *-*)
        VERSION_PRE_RELEASE="${VERSION#*-}"
        VERSION_PRE_RELEASE="${VERSION_PRE_RELEASE%%+*}"
        ;;
    esac

    __msgInfo "Version: ${VERSION}"
    __msgInfo "Version [major]: ${VERSION_MAJOR}"
    __msgInfo "Version [minor]: ${VERSION_MINOR}"
    __msgInfo "Version [patch]: ${VERSION_PATCH}"
    __msgInfo "Version [pre-release]: ${VERSION_PRE_RELEASE}"
}

##############################
# Change image tag to latest
# Globals:
#   REGISTRY_SERVER
#   SAVE_VERSION
# Arguments:
#   $1 String - image name with tag
# Return:
#   None
##############################
bumpVersion() {
    local currentVersion
    currentVersion=$(node -p "require('./package.json').version")
#    echo "Enter new version: (eg. ${currentVersion})"
#    read newVersion
    parseSemVer "$currentVersion"
    if [[ "$currentVersion" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        __msgInfo "Bump release from $currentVersion to $newVersion"
    fi
#    if [[ "$newVersion" == "$currentVersion" ]]; then
#    fi

}

TEMP=$(getopt -o "$SHORT_ARGS" --long "$LONG_ARGS" -n 'options' -- "$@" || exit 1)

eval set -- "$TEMP"

while [[ $# -gt 0 ]]; do
    case $1 in
    -b | --bump)
        BUMP=1
        shift
        ;;
    -d | --debug)
        DEBUG=1
        shift
        ;;
    -h | --help)
        echo "$usage"
        exit 0
        ;;
    -v | --version)
        echo "$VER"
        exit 0
        ;;
    --)
        shift
        break
        ;;
    *) break ;;
    esac
done

if [ "$0" == "$(dirname "$0")/build.sh" ]; then
#    if [ $# -eq 0 ]; then
#        __msgErr "Images missing" 1
#        echo "$usage"
#        exit 1
#    fi


    [ "$BUMP" -eq 1 ] && bumpVersion

fi

