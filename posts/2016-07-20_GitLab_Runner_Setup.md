(((
Title: GitLab Runner Setup
Date: 2016-07-20 10:46:00
Author: Nicholas Zwart
Summary: Quick notes on setting up a Gitlab Runner.
)))

# Linux 

## Summary
This setup is for a virtual machine running Ubuntu 64bit (15.10, headless) in
conjuction with the cloud version of gitlab using their free 'coordinator'.
The virtual machine is behind a firewall and runs on a host with VM-Workstation
Player 12 running Ubuntu 64bit (12.04, headless).

## Steps

### 1. Install Gitlab Runner on the VM
From the instructions on
[gitlab.com](https://gitlab.com/gitlab-org/gitlab-ci-multi-runner/blob/master/docs/install/linux-repository.md),
run the following commands:

```bash
curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-ci-multi-runner/script.deb.sh | sudo bash
sudo apt-get install gitlab-ci-multi-runner
sudo gitlab-ci-multi-runner register
```

The runner registration info can be found on under the 'runners' tab from in
the desired project:
```
https://gitlab.com/<group>/<repo>/runners
```
The 'Shared runners' option was disabled since they likely don't have the
specific requirements for this build, which are maintained internally.

This basically says to enter the free CI 'coordinator' URL:
```
Specify the following URL during runner setup: 
https://gitlab.com/ci
```
Use the following registration token during setup:
```
<some alpha numeric token to copy and paste>
```

The next questions are for identification of the runner (from the web
interface) and some tags that explain what the runner is good for.  In this
case, its for a GPI node compilation:
```
Please enter the gitlab-ci description for this runner:
[gpilab]: ubuntu64
Please enter the gitlab-ci tags for this runner (comma separated):
gpi,python3
```

Since the compilation is not very complicated I assumed a shell environment
would be sufficient for this -since I hadn't built the script yet.
```
Please enter the executor: ssh, virtualbox, docker+machine, docker-ssh+machine, docker, docker-ssh, parallels, shell:
shell

...

The runner should be auto-started.
```

This can be verified with:
```bash
ps aux | grep gitlab-runner
```

Which returns something like:
```
root      4355  0.1  0.3  60016 13352 ?        Ssl  10:45   0:01 /usr/bin/gitlab-ci-multi-runner run --working-directory /home/gitlab-runner --config /etc/gitlab-runner/config.toml --service gitlab-runner --syslog --user gitlab-runner
```

### Windows
The `gitlab-ci-multi-runner` command can install itself as a service, however,
this service will be unable to access UI elements.  If those are necessary
for say testing pipelines, then you'll have to set the gitlab-runner to launch
as a scheduled task
(see [gitlab issue 1046](https://gitlab.com/gitlab-org/gitlab-ci-multi-runner/issues/1046)).

The following steps where modified from [some sage install guide](http://www.greytrix.com/blogs/sageaccpacerp/2013/08/20/auto-execution-of-exe-file-using-windows-scheduler-in-sage-300-erp/):
* Navigate to Start >> Control Panel >> Administrative Tools >> Task Scheduler
* Click on Task Scheduler >> Create Task option

General Tab:
    Name: gitlab_runner_startup
    Run only When user is logged in: x
    Run with the highest privileges: x
    Configure For: <your windows version>

* Then navigate to Action tab and select New.
* ‘New Action’ UI will get opened.
* In ‘Program/Script’ select ‘EXE’ file, for which you want to run using Browse
  button.
* In ‘Add arguments (optional)’ field, enter 'run'
* In the "Start in (optional)" field, enter the location of the 'config.toml'
  file that was used to setup the runner.
* Click on OK >> ‘New Action’ UI will get closed.
* Now, navigate to Triggers Tab >> New >> ‘New Trigger’; an UI will get opened.

    Begin the task: At log on
    Specific user: <your intended user>
    Delay task for: <whatever time your extra components need to boot>
    Enabled: x

* Make sure the selected user is going to be auto-logged in.
* Click on OK >> New Trigger UI will get closed.
* Now click on OK button in ‘Create Task’ UI.

#### Save the Schedule as an XML File
* Find the 'gitlab_runner_startup' task in the 'Active Tasks' section and
  double click it. -this will open the 'Actions' menu to the right.
* Click on the 'Export' feature to save the scheduled task for porting to other
  VMs or as a backup.
* Click 'Run' to test your task.

### 2. Add the .gitlab-ci.yml to the Project Repo
On the project homepage click the 'Set Up CI' button to add a template
`.gitlab-ci.yml` file to the root directory of the project.  For this, I chose
the Nanoc template since it seemed like a good start.

Changed the job name to the GPI node that was being built and pointed the
`script:` tag to the packaging script that is contained in the root dir of the
repo with reference to the [GitLab Runner
Docs](http://docs.gitlab.com/ce/ci/yaml/README.html#image-and-services).
Switched artifacts to `\*.zip` and the correct build branch.

After commiting the yaml file, I opened the 'Pipelines' to find that the yaml
was invalid due to some unrecognized character. Using the yaml validator at
[https://gitlab.com/ci/lint](https://gitlab.com/ci/lint) I was able to
determine that file globbing must be done with a regex `/^\*.zip$/`.

### ssh keys
Deploy keys: http://docs.gitlab.com/ce/ci/ssh_keys/README.html
key gen: https://gitlab.com/help/ssh/README

VMware-Player-12.1.1-3770994.x86_64.bundle
VMware-VIX-1.15.0-2985596.x86_64.bundle
VMware-VIX-1.15.3-3770994.x86_64.bundle

