#!/usr/bin/env bash

set -o nounset
set -o pipefail

# Pre initialization
RUNNING_DIR=$(dirname "$(realpath "${BASH_SOURCE[0]}")")
ROOT_DIR=$(dirname "$RUNNING_DIR")
VER='1.0'
SHORT_ARGS='bdhv'
LONG_ARGS='bump,debug,help,version'

# Switch initialization
BUMP=1
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
    -b,     --no-bump               Disable bump project version
    -d,     --debug                 Debug mode (actually dry run mode with external logs)
    -h,     --help                  Show help message
    -v,     --version               Show script version
EOM

##############################
# Parse semantic version to global variables
# Globals:
#   VERSION_MAJOR
#   VERSION_MINOR_PATCH
#   VERSION_MINOR
#   VERSION_PATCH_PRE_RELEASE
#   VERSION_PATCH
#   VERSION_PRE_RELEASE
#   VERSION_PRE_RELEASE_TAG
# Arguments:
#   $1 String - Version
# Return:
#   None
##############################
parseSemVer() {
    local VERSION=$1

    VERSION_MAJOR="${VERSION%%.*}"
    VERSION_MINOR_PATCH="${VERSION#*.}"
    VERSION_MINOR="${VERSION_MINOR_PATCH%%.*}"
    VERSION_PATCH_PRE_RELEASE="${VERSION_MINOR_PATCH#*.}"
    VERSION_PATCH="${VERSION_PATCH_PRE_RELEASE%%[-+]*}"
    VERSION_PRE_RELEASE=""
    VERSION_PRE_RELEASE_TAG=""

    case "$VERSION" in
    *-*)
        VERSION_PRE_RELEASE="${VERSION#*-}"
        VERSION_PRE_RELEASE_TAG="${VERSION_PRE_RELEASE%%.*}"
        VERSION_PRE_RELEASE="${VERSION_PRE_RELEASE#*.}"
        ;;
    esac
}

##############################
# Bump version in project files
# Globals:
#   ROOT_DIR
#   VERSION_MAJOR
#   VERSION_MINOR
#   VERSION_PATCH
#   VERSION_PRE_RELEASE
#   VERSION_PRE_RELEASE_TAG
# Arguments:
#   None
# Return:
#   None
##############################
bumpVersion() {
    local currentVersion
    local newVersion
    local supposedVersion
    local branch
    branch=$(git rev-parse --abbrev-ref HEAD)
    __msgInfo "Current branch: ${branch}"

    currentVersion=$(node -p "require('./package.json').version")
    __msgInfo "Version: ${currentVersion}"

    parseSemVer "$currentVersion"
    __msgDebug "Version [major]: ${VERSION_MAJOR}"
    __msgDebug "Version [minor]: ${VERSION_MINOR}"
    __msgDebug "Version [patch]: ${VERSION_PATCH}"
    __msgDebug "Version [pre-release]: ${VERSION_PRE_RELEASE}"
    __msgDebug "Version [pre-release-tag]: ${VERSION_PRE_RELEASE_TAG}"

    supposedVersion="$VERSION_MAJOR.$VERSION_MINOR.$VERSION_PATCH-$VERSION_PRE_RELEASE_TAG.$((++VERSION_PRE_RELEASE))"
    if [ "$VERSION_PRE_RELEASE_TAG" == '' ]; then
        supposedVersion="$VERSION_MAJOR.$((++VERSION_MINOR)).0"
    fi

    read -r -p "Enter new version [${supposedVersion}]: " newVersion
    newVersion="${newVersion:-$supposedVersion}"
    if [[ "$newVersion" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] && [[ "$branch" != "master" ]]; then
        __msgErr "Release version with branch [$branch] is not supported"
        exit 1
    fi

    __msgInfo "Bump release from $currentVersion to $newVersion"

    if [ $DEBUG -eq 0 ]; then
        # Change version in package.json
        sed -i -e "s/$currentVersion/$newVersion/g" "$ROOT_DIR/package.json"

        # Change version in docker-compose.yaml
        sed -i -e "s/$currentVersion/$newVersion/g" "$ROOT_DIR/docker-compose.yaml"

        npm install &&
            git add "$ROOT_DIR/package.json" "$ROOT_DIR/package-lock.json" "$ROOT_DIR/docker-compose.yaml" &&
            git commit -m "chore: [skip ci] release $newVersion" &&
            git tag -a "v$newVersion" -m "chore: [skip ci] release $newVersion" &&
            git push origin "$branch" &&
            git push origin "v$newVersion"
    fi
}

##############################
# Build docker image
# Globals:
#   None
# Arguments:
#   None
# Return:
#   None
##############################
buildImages() {
    docker-compose -f "$ROOT_DIR/docker-compose.yaml" build
    docker-compose -f "$ROOT_DIR/docker-compose.yaml" push litminka-api
}

##############################

TEMP=$(getopt -o "$SHORT_ARGS" --long "$LONG_ARGS" -n 'options' -- "$@" || exit 1)

eval set -- "$TEMP"

while [[ $# -gt 0 ]]; do
    case $1 in
    -b | ---no-bump)
        BUMP=0
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
    __debug || buildImages && __msgDebug "Run build"
fi
