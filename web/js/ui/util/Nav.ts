import {Platforms} from '../../util/Platforms';

export class Nav {

    public static createHashURL(hash: string) {
        const url = new URL(window.location.href);
        url.hash = hash;
        return url.toString();
    }

    public static openLinkWithNewTab(link: string) {

        const win = window.open(link, '_blank');

        if (win) {
            win.focus();
        }

    }

    /**
     * Create a loader that can function outside of a authorized event loop
     * by pre-creating a window and then changing the location later.
     *
     */
    public static createLinkLoader(opts: LinkLoaderOpts = {focus: true}): LinkLoader {

        if (Platforms.type() === 'desktop') {
            return new DesktopLinkLoader(opts);
        } else {
            return new MobileLinkLoader();
        }

    }

}

class DesktopLinkLoader implements LinkLoader {

    private readonly win: Window;

    constructor(opts: LinkLoaderOpts) {

        const win = window.open('', '_blank');

        if (win) {

            this.win = win;

            if (opts.focus) {
                win.focus();
            }

            win.document.write("Loading...");

        } else {
            throw new Error("Unable to create window");
        }

    }

    public load(link: string): void {
        this.win.location.href = link;
    }

}

class MobileLinkLoader implements LinkLoader {

    public load(link: string): void {
        document.location!.href = link;
    }

}

export interface LinkLoaderOpts {
    readonly focus: boolean;
}

export interface LinkLoader {

    load(link: string): void;

}
