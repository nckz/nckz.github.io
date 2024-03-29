---
title: Shrinking VMware VMs with Fusion
date: 2016-07-21 19:16:00
author: Nicholas Zwart
summary: A .bashrc function for automating the defragmenting and shrinking of VMs.
featured_image: https://www.freepnglogos.com/uploads/vmware-png-logo/vmware-workstation-universal-keygen-png-logo-0.png
---

This is a little summary of the disk tools I like to use when working with
VMware VMs.  Most of the time I'm using an OSX host to serve OSX, Linux, and
Windows guests so most of these instruction are based on using OSX as the host.

# The Platform Used Here
The platform used in this work is:
1. OSX 10.11.5
2. GNU bash, version 3.2.57(1)-release (x86_64-apple-darwin15)
3. VMware Fusion Version 8.1.1 (3771013)

The `PATH` environment contains the `VMware Fusion.app` tools i.e.:
```bash
VMWARE="/Applications/VMware Fusion.app/Contents/Library"
PATH="$VMWARE:$PATH"
```

# Bash Function for Shrinking VMDKs

Add the following function to your ~/.bashrc:
```bash
# VMWARE
# assumes the PATH is setup
function shrinkVM {

    # path to vmware tool
    VDISKMAN="vmware-vdiskmanager"

    # find all vmx files
    VMX=()
    for name in $(find $1 -iname "*.vmx")
    do
        VMX+=($name)
    done

    # find all vmdk files
    VMDK=()
    for name in ${VMX[@]}
    do
        # get the current vmdk list from the vmx file
        IFS_backup=$IFS
        IFS=$'\n'
        VMDK_sub=($(grep -o "\".*\.vmdk\"" $name))
        IFS=$IFS_backup

        # get the location of these disks
        VMDK_dir=$(dirname $name)

        # append the relative dirs to the listed disks
        #for disk in ${VMDK_sub[@]}
        for ((i=0; i<${#VMDK_sub[@]}; i++));
        do
            disk=${VMDK_sub[$i]}
            disk="${disk%\"}" # remove suffix "
            disk="${disk#\"}" # remove prefix "
            disk=$( echo "$disk" | sed 's/ /\\ /g' ) # deref spaces
            VMDK+=("$(pwd)/${VMDK_dir}/${disk}")
        done
    done

    time {
        for ((i=0; i<${#VMDK[@]}; i++));
        do
            CMD="$VDISKMAN -d ${VMDK[$i]} && $VDISKMAN -k ${VMDK[$i]}"
            echo $CMD
            eval $CMD
        done
    }
}
```

Update your environment by
executing:
```bash
$ source .bashrc
```

Now you can run `shrinkVM` on your VM directory:
```bash
$ shrinkVM ./vmware/Ubuntu64.vmwarevm
```

Or on your entire collection of VMs:
```bash
$ shrinkVM ./vmware/
```

# Linux Guests
According to [Time
sinker](http://timesinker.blogspot.com/2011/01/shrinking-linux-virtual-disks-on-osx.html)
guest OS's other than windows can't be auto-cleaned because files that have
been removed (i.e. unlinked) still exist on the virtual disk and must be zeroed
out before shrinking.  Therefore it is necessary to run:
```bash
sudo cat /dev/zero > zero; sync; sleep 1; sudo rm zero
```
If you're doing this often you may want to alias this:
```bash
function zerofs {
    sudo time cat /dev/zero > zero; sync; sleep 1; sudo rm zero
}
```

NOTE: This is a simple way to zero the file system if you have enough disk
space on the host OS to hold the entire VM when the disk is fully expanded with
zeros. If not, you can follow these nifty instructions
[Shrinking VirtualBox Linux images with ZeroFree](https://snippets.khromov.se/shrinking-a-virtualbox-linux-image-with-zerofree/).

I had to keep a copy of Ubuntu to boot into and use apt-get to install
zerofree. I set VMware to boot via CD/DVD, selected Try Ubuntu (this
was 20.04). Then ran `fdisk -l` to list available devices; I chose `sda5`:

```bash
zerofree -v /dev/sda5
```

Then proceeded to use the shrink script.

## Ubuntu Guests
[Time
sinker](http://timesinker.blogspot.com/2011/01/shrinking-linux-virtual-disks-on-osx.html)
also suggests that you clean up any unneeded packages by running (a la [Ubuntu
Geek](http://www.ubuntugeek.com/cleaning-up-a-ubuntu-gnulinux-system-updated-with-ubuntu-14-10-and-more-tools-added.html)):
```bash
$ sudo apt-get autoclean; sudo apt-get clean; sudo apt-get autoremove
```
If you're doing this often you may want to alias this:
```bash
function cleanfs{
    sudo apt-get autoclean; sudo apt-get clean; sudo apt-get autoremove
    zerofs # from the 'Linux Guests' section above
}
```

# Windows 7 Guests
The VMware Tools installed on the guest also seem to have some shrink utils
that can be run in the guest itself -nice if you are only running vmplayer on
the host (see
[ServerFault](http://serverfault.com/questions/356681/vmplayer-virtual-disk-shrinking-compacting-defragmenting)).

```bash
$ cd "C:\Program Files\VMWare\VMware Tools"
$ VMwareToolboxCmd.exe disk list # see what disks can be shrunk
$ VMwareToolboxCmd.exe disk shrink c:\\
```
