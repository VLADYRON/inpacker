package inpacker.core;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.concurrent.BlockingDeque;
import java.util.function.Consumer;
import java.util.zip.ZipOutputStream;

public class ZipPacker<I extends PackItem> implements Packer<I> {

    @Override
    public void pack(BlockingDeque<I> itemsDeque,
                     File packDir,
                     String packName,
                     Consumer<I> newItemSuccess,
                     Consumer<I> newItemFail,
                     Runnable done,
                     Runnable failed) {
        try (final ZipOutputStream zos = new ZipOutputStream(new FileOutputStream(new File(packDir, packName + ".zip")))) {
            I item = takeItem(itemsDeque);
            if (item == null) {
                failed.run();
                return;
            }
            while (!item.getFileName().equals("end")) {
                final boolean added = PackSupport.addItemToZip(item, zos);
                if (added) newItemSuccess.accept(item);
                else newItemFail.accept(item);
                item = takeItem(itemsDeque);
                if (item == null) {
                    failed.run();
                    return;
                }
            }
        } catch (IOException e) {
            failed.run();
            return;
        }
        done.run();
    }

    private I takeItem(BlockingDeque<I> deque) {
        try {
            return deque.take();
        } catch (InterruptedException e) {
            return null;
        }
    }
}